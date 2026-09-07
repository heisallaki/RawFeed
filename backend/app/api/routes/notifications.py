from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.notifications import broadcast_important_events

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.post("/broadcast")
def broadcast(db: Session = Depends(get_db)):
    return broadcast_important_events(db)