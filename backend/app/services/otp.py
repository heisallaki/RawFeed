import secrets
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.config import get_settings
from app.core.security import hash_password, verify_password
from app.models.otp import OTPCode
from app.models.user import User

settings = get_settings()


def generate_code() -> str:
    return f"{secrets.randbelow(1_000_000):06d}"


def create_otp(db: Session, user: User, purpose: str) -> str:
    db.query(OTPCode).filter(
        OTPCode.user_id == user.id,
        OTPCode.purpose == purpose,
        OTPCode.consumed_at.is_(None),
    ).update({"consumed_at": datetime.now(timezone.utc)})

    code = generate_code()
    otp = OTPCode(
        user_id=user.id,
        purpose=purpose,
        code_hash=hash_password(code),
        max_attempts=settings.OTP_MAX_ATTEMPTS,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=settings.OTP_EXPIRE_MINUTES),
    )
    db.add(otp)
    db.commit()
    return code


def verify_otp(db: Session, user: User, purpose: str, code: str) -> bool:
    otp = (
        db.query(OTPCode)
        .filter(
            OTPCode.user_id == user.id,
            OTPCode.purpose == purpose,
            OTPCode.consumed_at.is_(None),
        )
        .order_by(OTPCode.created_at.desc())
        .first()
    )
    if otp is None:
        return False
    if otp.expires_at < datetime.now(timezone.utc):
        return False
    if otp.attempts >= otp.max_attempts:
        return False

    if verify_password(code, otp.code_hash):
        otp.consumed_at = datetime.now(timezone.utc)
        db.commit()
        return True

    otp.attempts += 1
    db.commit()
    return False