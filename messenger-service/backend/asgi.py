"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django_asgi_app = get_asgi_application()

from .middlewares import TokenAuthMiddlewareStack
import messenger.routing

application = ProtocolTypeRouter({
"http": django_asgi_app,
"websocket": TokenAuthMiddlewareStack(
        URLRouter(
            messenger.routing.websocket_urlpatterns
        )
    ),
})