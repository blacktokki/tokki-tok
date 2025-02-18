import requests
import re
import json
from django.conf import settings
from django.http import HttpResponse
from django.contrib.auth.signals import user_logged_in
from django.contrib.auth.models import update_last_login
from requests_toolbelt.multipart.encoder import MultipartEncoder
user_logged_in.disconnect(update_last_login, dispatch_uid='update_last_login')


def account_service_login(request, data):
    session = requests.Session()
    headers = {
        "X-FORWARDED-FOR": request.META.get('HTTP_X_FORWARDED_FOR'),
        "X-REAL-IP": request.META.get('HTTP_X_REAL_IP'),
        "User-Agent": request.META.get('HTTP_USER_AGENT')
    }
    # remote_addr = request.META.get('REMOTE_ADDR')

    mp_encoder = MultipartEncoder(fields=data)
    headers["Content-Type"] = mp_encoder.content_type
    res = session.post(f"{settings.ACCOUNT_SERVICE_URL}/login", headers=headers, data=mp_encoder)
    if res.ok and res.status_code == 200 and len(res.history) == 0:
        return session, None
    p = re.compile('(?<=\<div class="alert alert-danger" role="alert">)(.*?)(?=<\/div>)')  # noqa W605
    message = p.findall(res.text)
    return None, message[0] if len(message) else ''


def authenticate(request, username=None, password=None):
    session, _ = account_service_login(request, {'username': username, 'password': password})
    if session:
        return session.get(f"{settings.ACCOUNT_SERVICE_URL}/api/v1/user/?self=true")

