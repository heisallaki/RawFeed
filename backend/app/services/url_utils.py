def extract_article_url(entry) -> str | None:
    url = entry.get("link")
    if not url:
        for link in entry.get("links", []) or []:
            href = link.get("href")
            if href:
                url = href
                break
    if not url:
        return None
    url = url.strip()
    if not (url.startswith("http://") or url.startswith("https://")):
        return None
    return url