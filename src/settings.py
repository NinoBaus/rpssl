from dotenv import load_dotenv
import os

load_dotenv()

RANDOM_URL = "https://codechallenge.boohma.com/random"
WIN_MAP = {
    "rock": ["scissors", "lizard"],
    "paper": ["rock", "spock"],
    "scissors": ["paper", "lizard"],
    "lizard": ["spock", "paper"],
    "spock": ["scissors", "rock"]
}
CHOICES_MAP = {
    1: "rock",
    2: "paper",
    3: "scissors",
    4: "lizard",
    5: "spock"
}
BUFFER_SIZE = 500
BUFFER_NAME = 'random_buffer'
REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
REDIS_DB = int(os.getenv("REDIS_DB", "0"))
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", "")
REDIS_BROKER_URL = f'redis://{REDIS_HOST}:{REDIS_PORT}/{REDIS_DB}'
REDIS_BACKEND_URL = f'redis://{REDIS_HOST}:{REDIS_PORT}/{REDIS_DB}'
