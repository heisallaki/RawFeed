from sqlalchemy.orm import Session

from app.models.event import Event
from app.services.ai import call_ollama, fallback_why_it_matters


def build_prompt(event: Event) -> str:
    location = event.county if event.county else "the affected area"
    return (
        "Explain in two plain, non-sensational sentences why this news event "
        f"matters to ordinary people in {location}. Event title: {event.title}. "
        f"Category: {event.category}. Summary: {event.summary}. Do not repeat the title verbatim."
    )


def enrich_pending_events(db: Session, limit: int = 20) -> dict:
    events = (
        db.query(Event)
        .filter(Event.ai_enriched.is_(False))
        .order_by(Event.importance_score.desc(), Event.last_updated_at.desc())
        .limit(limit)
        .all()
    )

    processed = 0
    ai_generated = 0

    for event in events:
        result = call_ollama(build_prompt(event))
        if result:
            event.why_it_matters = result
            ai_generated += 1
        else:
            event.why_it_matters = fallback_why_it_matters(event.title, event.category, event.county, event.summary)
        event.ai_enriched = True
        db.commit()
        processed += 1

    return {"processed": processed, "ai_generated": ai_generated, "fallback_used": processed - ai_generated}