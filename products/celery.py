import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "products.settings")

app = Celery("products")
# app.conf.update(
#     broker_url="redis://localhost:6379/0",
#     result_backend=None,
#     broker_connection_retry_on_startup=True  # Add this line
# )
app.config_from_object("django.conf:settings", namespace="CELERY")

# Auto-discover tasks from installed Django apps
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f"Request: {self.request!r}")
 

# from myapp.tasks import send_expiry_notifications


# celery -A myapp worker --pool=solo --loglevel=info
# >>> from myapp.tasks import send_expiry_notifications
# >>> send_expiry_notifications.delay()