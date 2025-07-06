from fastapi import FastAPI

import models
import helpers
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/choices", response_model=list[models.Choice])
async def choices():
    return await helpers.get_all_choices()


@app.get("/choice", response_model=models.Choice)
async def choice():
    return helpers.get_random_choice()


@app.post("/play")
async def play(players_choice: models.PlayRequest):
    return await helpers.new_round(players_choice)
