import uuid
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.article import RawArticle
from app.models.event import Event
from app.models.source import NewsSource
from app.schemas.event import EventDetailRead, EventRead, EventSourceRead

router = APIRouter(prefix="/api/events", tags=["events"])


@router.get("", response_model=list[EventRead])
def list_events(
    category: str | None = Query(default=None),
    county: str | None = Query(default=None),
    status: str | None = Query(default=None),
    max_age_hours: int = Query(default=168, ge=0, le=8760),
    limit: int = Query(default=50, le=200),
    db: Session = Depends(get_db),
):
    query = db.query(Event)
    if category:
        query = query.filter(Event.category == category)
    if county:
        query = query.filter(Event.county == county)
    if status:
        query = query.filter(Event.status == status)
    if max_age_hours > 0:
        cutoff = datetime.now(timezone.utc) - timedelta(hours=max_age_hours)
        query = query.filter(Event.last_updated_at >= cutoff)

    return query.order_by(Event.importance_score.desc(), Event.last_updated_at.desc()).limit(limit).all()


@router.get("/{event_id}", response_model=EventDetailRead)
def get_event(event_id: uuid.UUID, db: Session = Depends(get_db)):
    event = db.get(Event, event_id)
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")

    joined = (
        db.query(RawArticle, NewsSource)
        .join(NewsSource, RawArticle.source_id == NewsSource.id)
        .filter(RawArticle.event_id == event_id)
        .all()
    )
    sources = [
        EventSourceRead(source_name=source.name, url=article.url, published_at=article.published_at)
        for article, source in joined
    ]

    return EventDetailRead(**EventRead.model_validate(event).model_dump(), sources=sources)