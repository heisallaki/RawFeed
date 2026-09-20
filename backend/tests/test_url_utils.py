from app.services.url_utils import extract_article_url


def test_extract_article_url_uses_link_field_unmodified():
    entry = {"link": "https://www.citizen.digital/news/international-news-story-12345"}
    assert extract_article_url(entry) == "https://www.citizen.digital/news/international-news-story-12345"


def test_extract_article_url_falls_back_to_links_list():
    entry = {"links": [{"href": "https://example.com/from-nepal-report"}]}
    assert extract_article_url(entry) == "https://example.com/from-nepal-report"


def test_extract_article_url_rejects_non_http_links():
    entry = {"link": "mailto:someone@example.com"}
    assert extract_article_url(entry) is None


def test_extract_article_url_returns_none_when_missing():
    entry = {}
    assert extract_article_url(entry) is None