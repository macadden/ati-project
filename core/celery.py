from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from core import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
app = Celery('core')
app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

# app.conf.task_routes = {
#     'apps.user.tasks.send_welcome_email': {'queue': 'emails'},
# }

# Tarea de depuración para pruebas
@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))


app.conf.update(
    result_backend='redis://localhost:6379/0',
    broker_url='redis://localhost:6379/0',
    task_serializer='json',
    result_serializer='json',
    accept_content=['json'],
    timezone='America/Argentina/Buenos_Aires',
    enable_utc=False,

    task_acks_late=True,
    task_retries=3,
    broker_connection_retry_on_startup=True,
    worker_prefetch_multiplier=1,
    task_time_limit=300,
    task_soft_time_limit=240,
    broker_connection_retry=True,
    broker_connection_max_retries=5,
    broker_connection_retry_interval=10,
)
