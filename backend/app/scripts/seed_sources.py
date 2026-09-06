import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.database import SessionLocal
from app.models.source import NewsSource

SEED_SOURCES = [
    {
        "name": "Kenya News Agency",
        "feed_url": "https://www.kenyanews.go.ke/feed/",
        "website_url": "https://www.kenyanews.go.ke",
        "credibility_tier": "official",
    },
    {
        "name": "Citizen Digital",
        "feed_url": "https://www.citizen.digital/feed.xml",
        "website_url": "https://www.citizen.digital",
        "credibility_tier": "mainstream",
    },
    {
        "name": "Capital FM Kenya",
        "feed_url": "https://www.capitalfm.co.ke/news/feed/",
        "website_url": "https://www.capitalfm.co.ke/news",
        "credibility_tier": "mainstream",
    },
    {
        "name": "KBC",
        "feed_url": "https://www.kbc.co.ke/feed/",
        "website_url": "https://www.kbc.co.ke",
        "credibility_tier": "official",
    },
    {
        "name": "Standard Media",
        "feed_url": "https://www.standardmedia.co.ke/rss/headlines.php",
        "website_url": "https://www.standardmedia.co.ke",
        "credibility_tier": "mainstream",
    },

]


def seed():
    db = SessionLocal()
    try:
        created = 0
        for entry in SEED_SOURCES:
            existing = db.query(NewsSource).filter(NewsSource.name == entry["name"]).first()
            if existing:
                continue
            db.add(NewsSource(**entry))
            created += 1
        db.commit()
        print(f"Seeded {created} new sources out of {len(SEED_SOURCES)} defined.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()