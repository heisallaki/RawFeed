from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database import get_db
from app.models.preferences import UserPreferences
from app.models.user import User
from app.schemas.user import PreferencesRead, PreferencesUpdate, UserRead

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=UserRead)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/me/preferences", response_model=PreferencesRead)
def read_preferences(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(UserPreferences).filter(UserPreferences.user_id == current_user.id).first()


@router.patch("/me/preferences", response_model=PreferencesRead)
def update_preferences(
    payload: PreferencesUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    preferences = db.query(UserPreferences).filter(UserPreferences.user_id == current_user.id).first()
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(preferences, field, value)
    db.commit()
    db.refresh(preferences)
    return preferences