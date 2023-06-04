from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_jwt.settings import api_settings
from channels.auth import AuthMiddlewareStack
from asgiref.sync import sync_to_async


class TokenAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        headers = dict(scope['headers'])
        token = headers.get(b"sec-websocket-protocol", b',').decode().split(",")[1]
        try:
            payload = api_settings.JWT_DECODE_HANDLER(token)
            scope['user'] = await sync_to_async(get_user_model().objects.get)(
                username=api_settings.JWT_PAYLOAD_GET_USERNAME_HANDLER(payload))
        except Exception:
            scope['user'] = AnonymousUser()
        return await self.inner(scope, receive, send)


TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))  # noqa E731
