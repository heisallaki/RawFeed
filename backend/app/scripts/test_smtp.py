import smtplib
import sys
from email.mime.text import MIMEText
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.config import get_settings

settings = get_settings()


def main():
    print(f"Host: {settings.SMTP_HOST}")
    print(f"Port: {settings.SMTP_PORT}")
    print(f"Username: {settings.SMTP_USERNAME}")
    print(f"Password length: {len(settings.SMTP_PASSWORD)} characters")
    print(f"From: {settings.SMTP_FROM_EMAIL or settings.SMTP_USERNAME}")
    print("-" * 50)

    if not settings.SMTP_HOST or not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
        print("One or more SMTP settings are empty. Check backend/.env.")
        return

    message = MIMEText("This is a RawFeed SMTP connectivity test.", "plain")
    message["Subject"] = "RawFeed SMTP test"
    message["From"] = settings.SMTP_FROM_EMAIL or settings.SMTP_USERNAME
    message["To"] = settings.SMTP_USERNAME

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
            server.set_debuglevel(1)
            server.starttls()
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.sendmail(message["From"], [settings.SMTP_USERNAME], message.as_string())
        print("-" * 50)
        print("SUCCESS: test email sent. Check the inbox.")
    except smtplib.SMTPAuthenticationError as error:
        print("-" * 50)
        print(f"AUTH FAILED (code {error.smtp_code}): {error.smtp_error.decode(errors='replace')}")
    except Exception as error:
        print("-" * 50)
        print(f"FAILED: {type(error).__name__}: {error}")


if __name__ == "__main__":
    main()