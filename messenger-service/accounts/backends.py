import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.models import AnonymousUser
from requests_toolbelt.multipart.encoder import MultipartEncoder
from django.contrib.auth.signals import user_logged_in
from django.contrib.auth.models import update_last_login
user_logged_in.disconnect(update_last_login, dispatch_uid='update_last_login')

class AuthBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None):
        sessions = requests.Session()
        url = f"http://{settings.TASK_SERVICE_DOMAIN}"
        csrf = sessions.get(f"{url}/api/v1/user/csrf/").content
        mp_encoder = MultipartEncoder(fields={'username': username, 'password': password})
        # remote_addr = request.META.get('REMOTE_ADDR')
        headers = {
            "X-FORWARDED-FOR": request.META.get('HTTP_X_FORWARDED_FOR'),
            "X-REAL-IP": request.META.get('HTTP_X_REAL_IP'),
            "User-Agent": request.META.get('HTTP_USER_AGENT'),
            "X-CSRF-TOKEN": csrf, 
            "Content-Type": mp_encoder.content_type
        }
        res = sessions.post(f"{url}/login", headers=headers, data=mp_encoder)
        if res.ok and res.status_code == 200 and len(res.history) == 0:
            res = sessions.get(f"{url}/api/v1/user/?self=true")
            _username = res.json().get('value')[0]['username']
            print(_username)
            # request.session['username'] = username
            return get_user_model().objects.get_by_natural_key(_username)
        return None

    def get_user(self, user_id):
        try:
            return get_user_model().objects.get(pk=user_id)
        except Exception:
            return AnonymousUser()