from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import verify_ingestion_access
from app.database import get_db
from app.services.enrichment import enrich_pending_events
from app.services.ingestion import run_ingestion

router = APIRouter(prefix="/api/ingestion", tags=["ingestion"])


@router.post("/run", dependencies=[Depends(verify_ingestion_access)])
def trigger_ingestion(db: Session = Depends(get_db)):
    return run_ingestion(db)


@router.post("/enrich", dependencies=[Depends(verify_ingestion_access)])
def trigger_enrichment(limit: int = Query(default=20, le=100), db: Session = Depends(get_db)):
    return enrich_pending_events(db, limit=limit)