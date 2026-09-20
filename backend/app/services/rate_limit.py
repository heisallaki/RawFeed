import logging

import redis

from app.redis_client import get_redis

logger = logging.getLogger("rawfeed")


def check_and_increment(key: str, max_calls: int, window_seconds: int) -> bool:
    try:
        client = get_redis()
        current = client.incr(key)
        if current == 1:
            client.expire(key, window_seconds)
        return current <= max_calls
    except redis.RedisError:
        logger.warning("Redis unavailable for rate limiting on key %s; allowing request through.", key)
        return True