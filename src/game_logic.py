import httpx
from fastapi import HTTPException

from services.celery.helpers import logger
from settings import RANDOM_URL, WIN_MAP, CHOICES_MAP, BUFFER_NAME
import models
from redis_client import redis_client


async def check_redis_client():
    try:
        redis_client.ping()
        return redis_client
    except ConnectionError as e:
        logger.error(e)
        return None
    except Exception as e:
        logger.error(e)
        return None


async def cpu_choice() -> int:
    r = await check_redis_client()
    if r:
        raw = r.rpop(BUFFER_NAME)
        logger.info(raw)
        if raw:
            return int(raw)

    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            r = await client.get(RANDOM_URL)
            r.raise_for_status()
            return r.json()["random_number"]
    except Exception as e:
        raise HTTPException(status_code=500, detail="CPU is currently dead")


async def get_cpu_choice_from_random_number(random_generated_number: int):
    cpu_picked = (random_generated_number % len(CHOICES_MAP)) + 1
    return CHOICES_MAP[cpu_picked]


async def calculate_winner(player_picked, cpu_picked):
    result = "lose"
    if player_picked == cpu_picked:
        result = "tie"

    if cpu_picked in WIN_MAP[player_picked]:
        result = "win"

    return {
        "results": result,
        "player": player_picked,
        "computer": cpu_picked
    }


async def generate_winner(players_choice: models.PlayRequest):
    random_generated_number = await cpu_choice()
    cpu_picked = await get_cpu_choice_from_random_number(random_generated_number)
    player_picked = CHOICES_MAP[players_choice.player]

    return await calculate_winner(player_picked, cpu_picked)
