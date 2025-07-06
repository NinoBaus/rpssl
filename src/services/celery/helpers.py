import logging
import httpx
import settings
from redis_client import redis_client

logger = logging.getLogger(__name__)


def fetch_random_number():
    try:
        # After buffer has reached BUFFER_SIZE random choices, stop filling the buffer
        if redis_client.llen(settings.BUFFER_NAME) >= settings.BUFFER_SIZE:
            logger.info("Buffer full, skipping")
            return

        response = httpx.get(settings.RANDOM_URL, timeout=2)
        response.raise_for_status()
        number = response.json()["random_number"]
        redis_client.lpush(settings.BUFFER_NAME, number)
        logger.info(f"Pushed random number: {number}")
    except Exception as e:
        logger.error(f"Failed to fetch random number: {e}")
