from pyfcm import FCMNotification
from django.conf import settings

print('FCM_API_KEY', settings.FCM_API_KEY)
push_service = FCMNotification(api_key=settings.FCM_API_KEY)


def send_notification_message(notifications, data):
    push_service.multiple_devices_data_message(
        registration_ids=[n.token for n in notifications if n.token],
        data_message=data
    )
