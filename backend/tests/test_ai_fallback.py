from app.services.ai import fallback_why_it_matters


def test_fallback_why_it_matters_uses_county_when_present():
    text = fallback_why_it_matters(
        "Flooding hits Nakuru town", "security", "Nakuru", "Heavy rains caused flooding overnight."
    )
    assert "Nakuru" in text


def test_fallback_why_it_matters_uses_generic_location_when_county_missing():
    text = fallback_why_it_matters(
        "New AI policy announced", "technology_ai", None, "Government unveils new AI policy."
    )
    assert "affected area" in text


def test_fallback_why_it_matters_has_correctly_spaced_linked_sources():
    text = fallback_why_it_matters("Sample title", "health", "Kisumu", "Sample summary.")
    assert "linked sources" in text
    assert "linkedsources" not in text