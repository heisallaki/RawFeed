from app.constants.kenya import KENYA_COUNTIES


def extract_county(text: str) -> str | None:
    text_lower = text.lower()
    for county in KENYA_COUNTIES:
        if county.lower() in text_lower:
            return county
    return None