import json
from django.conf import settings
from pyfcm import FCMNotification

push_service = FCMNotification(service_account_file=settings.SERVICE_ACCOUNT_FILE, project_id='virtual-metrics-355712')


def send_notification_message(notifications, data):
    data_payload = {k: json.dumps(v) for k, v in data.items()}
    params_list = [{"fcm_token": n.token, "data_payload": data_payload} for n in notifications if n.token ]
    push_service.async_notify_multiple_devices(params_list=params_list, timeout=5)
