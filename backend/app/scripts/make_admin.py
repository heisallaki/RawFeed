import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.database import SessionLocal
from app.models.user import User


def main():
    if len(sys.argv) != 2:
        print("Usage: python -m scripts.make_admin <email>")
        return

    email = sys.argv[1]
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            print(f"No user found with email {email}. Register that account first.")
            return
        user.is_admin = True
        db.commit()
        print(f"{email} is now a RawFeed admin.")
    finally:
        db.close()


if __name__ == "__main__":
    main()