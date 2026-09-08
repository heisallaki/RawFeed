import logging
from datetime import datetime, timedelta

from apscheduler.schedulers.background import BackgroundScheduler

from app.config import get_settings
from app.database import SessionLocal
from app.services.enrichment import enrich_pending_events
from app.services.ingestion import run_ingestion

logger = logging.getLogger("rawfeed")
settings = get_settings()

scheduler = BackgroundScheduler()


def scheduled_ingestion() -> None:
    db = SessionLocal()
    try:
        result = run_ingestion(db)
        logger.info(
            "Scheduled ingestion complete: %s new articles, %s new events",
            result["total_new_articles"],
            result["total_new_events"],
        )
    except Exception:
        logger.exception("Scheduled ingestion run failed")
    finally:
        db.close()


def scheduled_enrichment() -> None:
    db = SessionLocal()
    try:
        result = enrich_pending_events(db, limit=20)
        logger.info("Scheduled enrichment complete: %s", result)
    except Exception:
        logger.exception("Scheduled enrichment run failed")
    finally:
        db.close()


def start_scheduler() -> None:
    if not settings.ENABLE_SCHEDULER:
        logger.info("Scheduler disabled via ENABLE_SCHEDULER=false")
        return
    if scheduler.running:
        return

    scheduler.add_job(
        scheduled_ingestion,
        "interval",
        minutes=settings.INGESTION_INTERVAL_MINUTES,
        id="ingestion",
        next_run_time=datetime.now(),
        max_instances=1,
        coalesce=True,
    )
    scheduler.add_job(
        scheduled_enrichment,
        "interval",
        minutes=settings.ENRICHMENT_INTERVAL_MINUTES,
        id="enrichment",
        next_run_time=datetime.now() + timedelta(minutes=2),
        max_instances=1,
        coalesce=True,
    )
    scheduler.start()
    logger.info(
        "Scheduler started: ingestion every %s min, enrichment every %s min",
        settings.INGESTION_INTERVAL_MINUTES,
        settings.ENRICHMENT_INTERVAL_MINUTES,
    )


def stop_scheduler() -> None:
    if scheduler.running:
        scheduler.shutdown(wait=False)