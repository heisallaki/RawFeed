from app.redis_client import get_redis


def check_and_increment(key: str, max_calls: int, window_seconds: int) -> bool:
    client = get_redis()
    current = client.incr(key)
    if current == 1:
        client.expire(key, window_seconds)
    return current <= max_calls