import httpx

from app.config import get_settings

settings = get_settings()


def call_ollama(prompt: str) -> str | None:
    try:
        response = httpx.post(
            f"{settings.OLLAMA_HOST}/api/generate",
            json={"model": settings.OLLAMA_MODEL, "prompt": prompt, "stream": False},
            timeout=30.0,
        )
        response.raise_for_status()
        data = response.json()
        text = data.get("response", "").strip()
        return text or None
    except Exception:
        return None


def generate_why_it_matters(title: str, category: str, county: str | None, summary: str) -> str:
    location = county if county else "Kenya"
    prompt = (
        "Explain in two plain, non-sensational sentences why this news event "
        f"matters to ordinary people in {location}. Event title: {title}. "
        f"Category: {category}. Summary: {summary}. Do not repeat the title verbatim."
    )
    result = call_ollama(prompt)
    if result:
        return result
    readable_category = category.replace("_", " ")
    return (
        f"This {readable_category} event affects {location} and may have practical "
        "consequences for residents. Check the linked sources for the latest updates."
    )