import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class EventSourceRead(BaseModel):
    source_name: str
    url: str
    published_at: datetime | None


class EventRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    summary: str
    category: str
    status: str
    country: str
    county: str | None
    importance_score: int
    importance_reasons: list[str]
    confidence_score: int
    why_it_matters: str | None
    what_we_know: list[str]
    what_we_dont_know: list[str]
    first_reported_at: datetime
    last_updated_at: datetime


class EventDetailRead(EventRead):
    sources: list[EventSourceRead]