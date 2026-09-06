CATEGORY_KEYWORDS = {
    "government_politics": [
        "parliament", "senate", "president", "cabinet", "county assembly",
        "governor", "election", "bill", "law", "ministry", "iebc", "policy",
    ],
    "economy_business": [
        "shilling", "inflation", "budget", "tax", "kra", "stock", "nse",
        "business", "trade", "economy", "loan", "imf",
    ],
    "technology_ai": [
        "technology", "artificial intelligence", " ai ", "startup", "app",
        "internet", "safaricom", "mpesa", "cybersecurity", "software",
    ],
    "science": [
        "research", "study finds", "scientists", "space", "climate study", "discovery",
    ],
    "health": [
        "hospital", "disease", "outbreak", "health ministry", "vaccine",
        "cholera", "cancer", "maternal", "nurses", "doctors strike",
    ],
    "security": [
        "police", "terrorism", "al-shabaab", "attack", "crime", "arrested",
        "insecurity", "gun", "bandit",
    ],
    "climate_weather": [
        "rain", "drought", "flood", "weather", "climate", "heatwave",
        "kenya meteorological",
    ],
    "transportation": [
        "matatu", "railway", "sgr", "airport", "road closed", "highway",
        "traffic", "bus", "flight",
    ],
    "emergencies_disasters": [
        "fire", "collapse", "landslide", "explosion", "disaster", "rescue",
        "evacuate", "tragedy",
    ],
    "public_figures": [
        "celebrity", "musician", "actor", "footballer", "socialite",
    ],
}


def classify_category(text: str) -> str:
    text_lower = f" {text.lower()} "
    best_category = "other"
    best_matches = 0
    for category, keywords in CATEGORY_KEYWORDS.items():
        matches = sum(1 for keyword in keywords if keyword in text_lower)
        if matches > best_matches:
            best_matches = matches
            best_category = category
    return best_category