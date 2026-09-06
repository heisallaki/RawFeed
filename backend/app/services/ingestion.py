import hashlib
from datetime import datetime, timezone

import feedparser
from sqlalchemy.orm import Session

from app.models.article import RawArticle
from app.models.event import Event
from app.models.source import NewsSource
from app.services.ai import generate_why_it_matters
from app.services.classification import classify_category
from app.services.clustering import find_matching_event
from app.services.geography import extract_county
from app.services.importance import score_confidence, score_importance


def parse_published_at(entry) -> datetime | None:
    if getattr(entry, "published_parsed", None):
        return datetime(*entry.published_parsed[:6], tzinfo=timezone.utc)
    return None


def run_ingestion(db: Session) -> dict:
    results = []
    total_new_articles = 0
    total_new_events = 0

    sources = db.query(NewsSource).filter(NewsSource.is_active.is_(True)).all()

    for source in sources:
        source_result = {"source_name": source.name, "new_articles": 0, "new_events": 0, "errors": []}
        try:
            parsed_feed = feedparser.parse(source.feed_url)
            if parsed_feed.bozo and not parsed_feed.entries:
                source_result["errors"].append(str(parsed_feed.bozo_exception))
                results.append(source_result)
                continue

            for entry in parsed_feed.entries:
                url = entry.get("link")
                if not url:
                    continue

                existing = db.query(RawArticle).filter(RawArticle.url == url).first()
                if existing:
                    continue

                title = entry.get("title", "").strip()
                if not title:
                    continue

                raw_summary = entry.get("summary", "")
                combined_text = f"{title} {raw_summary}".lower()
                content_hash = hashlib.sha256(f"{title}{url}".encode("utf-8")).hexdigest()

                category = classify_category(combined_text)
                county = extract_county(combined_text)

                article = RawArticle(
                    source_id=source.id,
                    title=title,
                    url=url,
                    raw_summary=raw_summary,
                    published_at=parse_published_at(entry),
                    content_hash=content_hash,
                )
                db.add(article)
                db.flush()

                event = find_matching_event(db, title, category, county)
                now = datetime.now(timezone.utc)

                if event is None:
                    event = Event(
                        title=title,
                        summary=raw_summary[:500],
                        category=category,
                        status="developing",
                        country="Kenya",
                        county=county,
                        importance_score=0,
                        importance_reasons=[],
                        confidence_score=0,
                        why_it_matters=None,
                        what_we_know=[title],
                        what_we_dont_know=["Full details are still developing."],
                        first_reported_at=now,
                        last_updated_at=now,
                    )
                    db.add(event)
                    db.flush()
                    source_result["new_events"] += 1
                    total_new_events += 1
                else:
                    event.last_updated_at = now
                    if title not in (event.what_we_know or []):
                        event.what_we_know = (event.what_we_know or []) + [title]

                article.event_id = event.id
                db.flush()

                article_count = db.query(RawArticle).filter(RawArticle.event_id == event.id).count()
                has_official_source = (
                    db.query(RawArticle)
                    .join(NewsSource, RawArticle.source_id == NewsSource.id)
                    .filter(RawArticle.event_id == event.id, NewsSource.credibility_tier == "official")
                    .first()
                    is not None
                )

                importance_score, reasons = score_importance(category, county, article_count, combined_text)
                confidence_score = score_confidence(article_count, has_official_source)

                event.importance_score = importance_score
                event.importance_reasons = reasons
                event.confidence_score = confidence_score
                event.status = "confirmed" if article_count >= 2 else "developing"

                if not event.why_it_matters:
                    event.why_it_matters = generate_why_it_matters(event.title, category, county, event.summary)

                db.commit()
                source_result["new_articles"] += 1
                total_new_articles += 1

        except Exception as error:
            db.rollback()
            source_result["errors"].append(str(error))

        results.append(source_result)

    return {
        "results": results,
        "total_new_articles": total_new_articles,
        "total_new_events": total_new_events,
    }