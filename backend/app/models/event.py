import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Integer, JSON, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Event(Base):
    __tablename__ = "events"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(512), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(32), nullable=False)
    status: Mapped[str] = mapped_column(String(16), default="developing", nullable=False)
    country: Mapped[str | None] = mapped_column(String(64), nullable=True)
    county: Mapped[str | None] = mapped_column(String(64), nullable=True)
    importance_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    importance_reasons: Mapped[list] = mapped_column(JSON, default=list)
    confidence_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    why_it_matters: Mapped[str | None] = mapped_column(Text, nullable=True)
    ai_enriched: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    what_we_know: Mapped[list] = mapped_column(JSON, default=list)
    what_we_dont_know: Mapped[list] = mapped_column(JSON, default=list)
    first_reported_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    last_updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))