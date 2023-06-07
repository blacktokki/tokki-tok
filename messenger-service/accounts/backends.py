from django.contrib.auth import get_user_model
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.models import AnonymousUser
from .requests import authenticate


class AuthBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None):
        res = authenticate(request, username, password)
        if res:
            username = res.json().get('value')[0]['username']
            # request.session['username'] = username
            return get_user_model().objects.get_by_natural_key(username)
        return None

    def get_user(self, user_id):
        try:
            return get_user_model().objects.get(pk=user_id)
        except Exception:
            return AnonymousUser()
