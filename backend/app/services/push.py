import httpx

EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"


def send_push_batch(messages: list[dict]) -> bool:
    if not messages:
        return True
    try:
        response = httpx.post(EXPO_PUSH_URL, json=messages, timeout=10.0)
        response.raise_for_status()
        return True
    except Exception:
        return False