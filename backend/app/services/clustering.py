import re
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models.event import Event

STOPWORDS = {
    "the", "a", "an", "in", "on", "at", "to", "of", "and", "for", "is", "are",
    "was", "were", "by", "with", "after", "before", "as", "from", "its", "it's",
    "over", "into", "amid", "says", "say", "said",
}


def tokenize(text: str) -> set[str]:
    words = re.findall(r"[a-zA-Z']+", text.lower())
    return {word for word in words if word not in STOPWORDS and len(word) > 2}


def jaccard_similarity(a: set[str], b: set[str]) -> float:
    if not a or not b:
        return 0.0
    intersection = len(a & b)
    union = len(a | b)
    return intersection / union if union else 0.0


def find_matching_event(db: Session, title: str, category: str, county: str | None) -> Event | None:
    window_start = datetime.now(timezone.utc) - timedelta(hours=48)
    candidates = (
        db.query(Event)
        .filter(Event.category == category)
        .filter(Event.last_updated_at >= window_start)
        .all()
    )

    title_tokens = tokenize(title)
    best_match = None
    best_score = 0.0

    for candidate in candidates:
        if county and candidate.county and candidate.county != county:
            continue
        candidate_tokens = tokenize(candidate.title)
        similarity = jaccard_similarity(title_tokens, candidate_tokens)
        if similarity > best_score:
            best_score = similarity
            best_match = candidate

    if best_score >= 0.35:
        return best_match
    return None