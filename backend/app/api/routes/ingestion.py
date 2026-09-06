from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.ingestion import run_ingestion

router = APIRouter(prefix="/api/ingestion", tags=["ingestion"])


@router.post("/run")
def trigger_ingestion(db: Session = Depends(get_db)):
    return run_ingestion(db)