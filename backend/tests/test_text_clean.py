from app.services.text_clean import strip_html


def test_strip_html_removes_tags_and_entities():
    raw = "<p>Fire &amp; rescue teams responded quickly.</p>"
    result = strip_html(raw)
    assert "<" not in result
    assert "&amp;" not in result
    assert "Fire & rescue teams responded quickly." == result


def test_strip_html_removes_doctype_and_document_markup():
    raw = "<!doctype html><html><body><h1>Breaking</h1><p>Details here.</p></body></html>"
    result = strip_html(raw)
    assert "<" not in result
    assert "doctype" not in result.lower()
    assert "Breaking" in result
    assert "Details here." in result


def test_strip_html_handles_empty_and_none():
    assert strip_html("") == ""
    assert strip_html(None) == ""