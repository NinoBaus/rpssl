import models
from random import randint
from game_logic import generate_winner
from settings import CHOICES_MAP


async def get_all_choices():
    return [{"id": choice_id, "name": sign} for choice_id, sign in CHOICES_MAP.items()]


def get_random_choice():
    random_id = randint(1, len(CHOICES_MAP))
    return {"id": random_id, "name": CHOICES_MAP[random_id]}


async def new_round(players_choice: models.PlayRequest):
    return await generate_winner(players_choice)
