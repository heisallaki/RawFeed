from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError
from sqlalchemy.orm import Session

from app.config import get_settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.database import get_db
from app.models.preferences import UserPreferences
from app.models.user import User
from app.schemas.auth import (
    EmailVerifyRequest,
    MessageResponse,
    PasswordResetConfirm,
    PasswordResetRequest,
    RefreshRequest,
    ResendVerificationRequest,
    Token,
)
from app.schemas.user import UserCreate, UserRead
from app.services.email_service import send_password_reset_email, send_verification_email
from app.services.otp import create_otp, verify_otp
from app.services.rate_limit import check_and_increment

router = APIRouter(prefix="/api/auth", tags=["auth"])
settings = get_settings()


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = User(email=payload.email, hashed_password=hash_password(payload.password))
    db.add(user)
    db.flush()

    preferences = UserPreferences(user_id=user.id)
    db.add(preferences)
    db.commit()
    db.refresh(user)

    code = create_otp(db, user, "email_verification")
    send_verification_email(user.email, code)

    return user


@router.post("/verify-email", response_model=UserRead)
def verify_email(payload: EmailVerifyRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user.is_verified:
        return user

    if not verify_otp(db, user, "email_verification", payload.code):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired code")

    user.is_verified = True
    db.commit()
    db.refresh(user)
    return user


@router.post("/resend-verification", response_model=MessageResponse)
def resend_verification(payload: ResendVerificationRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if user is not None and not user.is_verified:
        rate_limit_key = f"otp:resend-verification:{payload.email}"
        if check_and_increment(rate_limit_key, max_calls=1, window_seconds=settings.OTP_RESEND_COOLDOWN_SECONDS):
            code = create_otp(db, user, "email_verification")
            send_verification_email(user.email, code)

    return MessageResponse(message="If that account exists and is unverified, a new code has been sent.")


@router.post("/request-password-reset", response_model=MessageResponse)
def request_password_reset(payload: PasswordResetRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if user is not None:
        rate_limit_key = f"otp:password-reset:{payload.email}"
        if check_and_increment(rate_limit_key, max_calls=1, window_seconds=settings.OTP_RESEND_COOLDOWN_SECONDS):
            code = create_otp(db, user, "password_reset")
            send_password_reset_email(user.email, code)

    return MessageResponse(message="If that account exists, a password reset code has been sent.")


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(payload: PasswordResetConfirm, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if user is None or not verify_otp(db, user, "password_reset", payload.code):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired code")

    user.hashed_password = hash_password(payload.new_password)
    db.commit()
    return MessageResponse(message="Password has been reset. You can now log in with your new password.")


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if user is None or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is disabled")

    return Token(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
    )


@router.post("/refresh", response_model=Token)
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
    )
    try:
        decoded = decode_token(payload.refresh_token)
        if decoded.get("type") != "refresh":
            raise credentials_exception
        user_id = decoded.get("sub")
    except JWTError:
        raise credentials_exception

    user = db.get(User, user_id)
    if user is None or not user.is_active:
        raise credentials_exception

    return Token(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
    )