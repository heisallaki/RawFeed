from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models.device_token import DeviceToken
from app.models.event import Event
from app.models.preferences import UserPreferences
from app.services.push import send_push_batch

LEVEL_THRESHOLDS = {"critical": 90, "high": 70, "medium": 50}


def broadcast_important_events(db: Session, lookback_minutes: int = 60) -> dict:
    window_start = datetime.now(timezone.utc) - timedelta(minutes=lookback_minutes)
    events = (
        db.query(Event)
        .filter(Event.notified_at.is_(None))
        .filter(Event.last_updated_at >= window_start)
        .filter(Event.importance_score >= LEVEL_THRESHOLDS["medium"])
        .all()
    )

    if not events:
        return {"events_considered": 0, "notifications_sent": 0}

    preferences = db.query(UserPreferences).filter(UserPreferences.notification_level != "off").all()
    notifications_sent = 0

    for event in events:
        eligible_user_ids = [
            preference.user_id
            for preference in preferences
            if event.importance_score >= LEVEL_THRESHOLDS.get(preference.notification_level, 1000)
        ]

        if eligible_user_ids:
            tokens = (
                db.query(DeviceToken.expo_push_token)
                .filter(DeviceToken.user_id.in_(eligible_user_ids))
                .all()
            )
            messages = [
                {
                    "to": token[0],
                    "title": event.title,
                    "body": event.why_it_matters or event.summary[:120],
                    "data": {"event_id": str(event.id)},
                }
                for token in tokens
            ]
            if send_push_batch(messages):
                notifications_sent += len(messages)

        event.notified_at = datetime.now(timezone.utc)
        db.commit()

    return {"events_considered": len(events), "notifications_sent": notifications_sent}