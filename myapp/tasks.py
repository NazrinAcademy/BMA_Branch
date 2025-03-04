# # myapp/tasks.py
# from celery import shared_task
# from django.core.mail import send_mail
# from django.utils.timezone import now
# from datetime import timedelta
# from myapp.models import SubscriptionPlan, Notification

# @shared_task
# def send_expiry_notifications():
#     today = now().date()
#     notifications_sent = []

#     subscriptions = SubscriptionPlan.objects.filter(is_active=True)
#     for sub in subscriptions:
#         if sub.created_at:
#             expire_date = sub.created_at.date() + timedelta(days=sub.duration_days)
#             admin = sub.admin

#             notification_dates = {
#                 "7 days before expiry": expire_date - timedelta(days=7),
#                 "5 days before expiry": expire_date - timedelta(days=5),
#                 "1 day before expiry": expire_date - timedelta(days=1),
#                 "Expired": expire_date,
#             }

#             for msg, notify_date in notification_dates.items():
#                 if notify_date == today:
#                     message = f"Dear {admin.email}, your subscription for {sub.plan_name} is {msg}."
#                     Notification.objects.create(admin=admin, type="Subscription Alert", message=message)

#                     send_mail(
#                         subject="Subscription Expiry Notification",
#                         message=message,
#                         from_email="sufahaniya@gmail.com",
#                         recipient_list=[admin.email],
#                         fail_silently=False,
#                     )

#                     notifications_sent.append({"admin": admin.email, "message": message})

#     return {"message": "Notifications sent successfully", "data": notifications_sent}


from celery import shared_task
from django.core.mail import send_mail
from django.utils.timezone import now
from datetime import timedelta
from myapp.models import SubscriptionPlan, Notification

def send_notification(admin, message, email=True):
    Notification.objects.create(admin=admin, type="Subscription Alert", message=message)
    if email:
        send_mail(
            subject="Subscription Expiry Notification",
            message=message,
            from_email="sufahaniya@gmail.com",
            recipient_list=[admin.email],
            fail_silently=False,
        )

@shared_task
def send_expiry_notifications():
    today = now().date()
    notifications_sent = []

    subscriptions = SubscriptionPlan.objects.filter(is_active=True)
    for sub in subscriptions:
        if sub.created_at:
            expire_date = sub.created_at.date() + timedelta(days=sub.duration_days)
            admin = sub.admin
            
            if today == expire_date - timedelta(days=7):
                message = f"Dear {admin.email}, your subscription for {sub.plan_name} expires in 7 days. Renew now!"
                send_notification(admin, message)
            
            if today == expire_date - timedelta(days=3):
                message = f"Dear {admin.email}, your subscription for {sub.plan_name} expires in 3 days. Please renew now!"
                send_notification(admin, message)
            
            if today == expire_date:
                message = f"Dear {admin.email}, your subscription for {sub.plan_name} has expired. The app is now in read-only mode for 48 hours."
                send_notification(admin, message)
            
            if today == expire_date + timedelta(days=2):
                message = f"Dear {admin.email}, your 48-hour grace period is over. Access is now restricted until renewal."
                send_notification(admin, message)
            
            notifications_sent.append({"admin": admin.email, "message": message})
    
    return {"message": "Notifications sent successfully", "data": notifications_sent}
