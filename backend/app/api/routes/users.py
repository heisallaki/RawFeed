from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_current_verified_user
from app.config import get_settings
from app.database import get_db
from app.models.device_token import DeviceToken
from app.models.preferences import UserPreferences
from app.models.user import User
from app.schemas.auth import MessageResponse
from app.schemas.user import (
    DeletionConfirm,
    DeviceTokenRegister,
    PreferencesRead,
    PreferencesUpdate,
    UserRead,
)
from app.services.email_service import send_account_deletion_email
from app.services.otp import create_otp, verify_otp
from app.services.rate_limit import check_and_increment

router = APIRouter(prefix="/api/users", tags=["users"])
settings = get_settings()


@router.get("/me", response_model=UserRead)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/me/preferences", response_model=PreferencesRead)
def read_preferences(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(UserPreferences).filter(UserPreferences.user_id == current_user.id).first()


@router.patch("/me/preferences", response_model=PreferencesRead)
def update_preferences(
    payload: PreferencesUpdate,
    current_user: User = Depends(get_current_verified_user),
    db: Session = Depends(get_db),
):
    preferences = db.query(UserPreferences).filter(UserPreferences.user_id == current_user.id).first()
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(preferences, field, value)
    db.commit()
    db.refresh(preferences)
    return preferences


@router.post("/me/request-deletion", response_model=MessageResponse)
def request_deletion(
    current_user: User = Depends(get_current_verified_user),
    db: Session = Depends(get_db),
):
    rate_limit_key = f"otp:account-deletion:{current_user.email}"
    if check_and_increment(rate_limit_key, max_calls=1, window_seconds=settings.OTP_RESEND_COOLDOWN_SECONDS):
        code = create_otp(db, current_user, "account_deletion")
        send_account_deletion_email(current_user.email, code)
        return MessageResponse(message="A deletion confirmation code has been sent to your email.")

    raise HTTPException(
        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        detail="Please wait before requesting another deletion code.",
    )


@router.post("/me/confirm-deletion", response_model=MessageResponse)
def confirm_deletion(
    payload: DeletionConfirm,
    current_user: User = Depends(get_current_verified_user),
    db: Session = Depends(get_db),
):
    if not verify_otp(db, current_user, "account_deletion", payload.code):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired code")

    db.delete(current_user)
    db.commit()
    return MessageResponse(message="Your account has been permanently deleted.")


@router.post("/me/devices", response_model=MessageResponse)
def register_device(
    payload: DeviceTokenRegister,
    current_user: User = Depends(get_current_verified_user),
    db: Session = Depends(get_db),
):
    existing = db.query(DeviceToken).filter(DeviceToken.expo_push_token == payload.expo_push_token).first()
    if existing:
        existing.user_id = current_user.id
        existing.platform = payload.platform
    else:
        db.add(
            DeviceToken(
                user_id=current_user.id,
                expo_push_token=payload.expo_push_token,
                platform=payload.platform,
            )
        )
    db.commit()
    return MessageResponse(message="Device registered for notifications.")