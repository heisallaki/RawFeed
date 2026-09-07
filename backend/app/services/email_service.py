import httpx

from app.config import get_settings

settings = get_settings()


def send_email(to: str, subject: str, body: str) -> bool:
    if settings.EMAIL_PROVIDER == "resend":
        return _send_via_resend(to, subject, body)
    return _send_via_console(to, subject, body)


def _send_via_console(to: str, subject: str, body: str) -> bool:
    print("----- RawFeed email (console provider) -----")
    print(f"To: {to}")
    print(f"Subject: {subject}")
    print(body)
    print("---------------------------------------------")
    return True


def _send_via_resend(to: str, subject: str, body: str) -> bool:
    if not settings.RESEND_API_KEY:
        return _send_via_console(to, subject, body)
    try:
        response = httpx.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {settings.RESEND_API_KEY}"},
            json={"from": settings.EMAIL_FROM, "to": [to], "subject": subject, "text": body},
            timeout=10.0,
        )
        response.raise_for_status()
        return True
    except Exception:
        return False


def send_verification_email(to: str, code: str) -> bool:
    subject = "Your RawFeed verification code"
    body = (
        "RawFeed\n\n"
        "Verification code\n\n"
        f"Your RawFeed verification code is:\n\n{code}\n\n"
        f"This code expires in {settings.OTP_EXPIRE_MINUTES} minutes.\n\n"
        "If you did not request this code, you can safely ignore this message."
    )
    return send_email(to, subject, body)


def send_password_reset_email(to: str, code: str) -> bool:
    subject = "Your RawFeed password reset code"
    body = (
        "RawFeed\n\n"
        "Password reset code\n\n"
        f"Your RawFeed password reset code is:\n\n{code}\n\n"
        f"This code expires in {settings.OTP_EXPIRE_MINUTES} minutes.\n\n"
        "If you did not request this, you can safely ignore this message."
    )
    return send_email(to, subject, body)


def send_account_deletion_email(to: str, code: str) -> bool:
    subject = "Confirm RawFeed account deletion"
    body = (
        "RawFeed\n\n"
        "Account deletion confirmation\n\n"
        f"Your RawFeed account deletion code is:\n\n{code}\n\n"
        f"This code expires in {settings.OTP_EXPIRE_MINUTES} minutes.\n\n"
        "This action is permanent and cannot be undone. If you did not request this, "
        "change your password immediately."
    )
    return send_email(to, subject, body)