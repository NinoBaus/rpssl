from pydantic import BaseModel, conint
from enum import Enum


class ChoiceEnum(int, Enum):
    rock = 1
    paper = 2
    scissors = 3
    lizard = 4
    spock = 5


class Choice(BaseModel):
    id: int
    name: str


class PlayRequest(BaseModel):
    player: conint(ge=1, le=5)
