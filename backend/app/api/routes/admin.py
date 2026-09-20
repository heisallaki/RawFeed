import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin_user
from app.database import get_db
from app.models.user import User
from app.schemas.user import AdminUserRead

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/users", response_model=list[AdminUserRead])
def list_users(current_admin: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    return db.query(User).order_by(User.reactivation_requested.desc(), User.created_at.desc()).all()


@router.post("/users/{user_id}/deactivate", response_model=AdminUserRead)
def deactivate_user(
    user_id: uuid.UUID,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    target = db.get(User, user_id)
    if target is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if target.id == current_admin.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot deactivate your own account")

    target.is_active = False
    db.commit()
    db.refresh(target)
    return target


@router.post("/users/{user_id}/activate", response_model=AdminUserRead)
def activate_user(
    user_id: uuid.UUID,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    target = db.get(User, user_id)
    if target is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    target.is_active = True
    target.reactivation_requested = False
    db.commit()
    db.refresh(target)
    return target