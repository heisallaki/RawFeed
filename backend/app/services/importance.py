CATEGORY_BASE_SCORES = {
    "emergencies_disasters": 80,
    "security": 70,
    "health": 60,
    "government_politics": 60,
    "economy_business": 55,
    "climate_weather": 55,
    "transportation": 50,
    "technology_ai": 40,
    "science": 40,
    "public_figures": 30,
    "other": 20,
}

URGENT_KEYWORDS = [
    "dead", "killed", "dies", "emergency", "evacuate", "evacuation",
    "collapse", "explosion", "outbreak", "warning", "flood", "landslide",
    "fire", "attack", "crash", "closed", "shutdown", "strike", "protest", "riot",
]


def score_importance(category: str, county: str | None, source_count: int, text_lower: str) -> tuple[int, list[str]]:
    reasons = []
    score = CATEGORY_BASE_SCORES.get(category, 20)
    reasons.append(f"Base score for category '{category}': {score}")

    if county is None:
        score += 10
        reasons.append("Affects the whole country rather than a single county: +10")
    else:
        reasons.append(f"Localized to {county} county")

    source_bonus = min(max(source_count - 1, 0), 3) * 5
    if source_bonus > 0:
        score += source_bonus
        reasons.append(f"Corroborated by {source_count} independent articles: +{source_bonus}")

    matched_keywords = [keyword for keyword in URGENT_KEYWORDS if keyword in text_lower]
    if matched_keywords:
        score += 10
        reasons.append(f"Contains urgency indicators ({', '.join(matched_keywords[:3])}): +10")

    score = max(0, min(score, 100))
    return score, reasons


def score_confidence(source_count: int, has_official_source: bool) -> int:
    if source_count >= 3:
        confidence = 90
    elif source_count == 2:
        confidence = 70
    else:
        confidence = 50
    if has_official_source:
        confidence = min(confidence + 5, 98)
    return confidence