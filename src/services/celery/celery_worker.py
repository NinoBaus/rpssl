from celery import Celery
from settings import REDIS_BROKER_URL, REDIS_BACKEND_URL

celery_app = Celery(
    "worker",
    broker=REDIS_BROKER_URL,
    backend=REDIS_BACKEND_URL,
    include=["services.celery.tasks"],
)

celery_app.conf.beat_schedule = {
    "update-rates-every-10-seconds": {
        "task": "services.celery.tasks.task_fetch_random_number",
        "schedule": 3.0,
    },
}
celery_app.conf.timezone = "UTC"
