from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.source import NewsSource
from app.schemas.source import SourceRead

router = APIRouter(prefix="/api/sources", tags=["sources"])


@router.get("", response_model=list[SourceRead])
def list_sources(db: Session = Depends(get_db)):
    return db.query(NewsSource).order_by(NewsSource.name).all()