from .celery_worker import celery_app
from .helpers import fetch_random_number, logger


@celery_app.task(name="services.celery.tasks.task_fetch_random_number")
def task_fetch_random_number():
    logger.info("Fetching random number")
    fetch_random_number()
