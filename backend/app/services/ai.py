import httpx

from app.config import get_settings

settings = get_settings()

ENRICHMENT_TIMEOUT_SECONDS = 20.0


def call_ollama(prompt: str, timeout: float = ENRICHMENT_TIMEOUT_SECONDS) -> str | None:
    try:
        response = httpx.post(
            f"{settings.OLLAMA_HOST}/api/generate",
            json={"model": settings.OLLAMA_MODEL, "prompt": prompt, "stream": False},
            timeout=timeout,
        )
        response.raise_for_status()
        data = response.json()
        text = data.get("response", "").strip()
        return text or None
    except Exception:
        return None


def fallback_why_it_matters(title: str, category: str, county: str | None, summary: str) -> str:
    location = county if county else "the affected area"
    readable_category = category.replace("_", " ")
    return (
        f"This {readable_category} event affects {location} and may have practical "
        "consequences for residents. Check the linked sources for the latest updates."
    )


def generate_why_it_matters(title: str, category: str, county: str | None, summary: str) -> str:
    location = county if county else "the affected area"
    prompt = (
        "Explain in two plain, non-sensational sentences why this news event "
        f"matters to ordinary people in {location}. Event title: {title}. "
        f"Category: {category}. Summary: {summary}. Do not repeat the title verbatim."
    )
    result = call_ollama(prompt)
    if result:
        return result
    return fallback_why_it_matters(title, category, county, summary)