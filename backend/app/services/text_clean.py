import html
import re
from html.parser import HTMLParser


class _TextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.chunks: list[str] = []

    def handle_data(self, data: str) -> None:
        self.chunks.append(data)


def strip_html(raw: str | None) -> str:
    if not raw:
        return ""
    try:
        parser = _TextExtractor()
        parser.feed(raw)
        parser.close()
        text = "".join(parser.chunks)
    except Exception:
        text = re.sub(r"<[^>]+>", " ", raw)
    text = html.unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    return text