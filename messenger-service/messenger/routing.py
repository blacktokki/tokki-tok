from django.urls import re_path

from . import consumers, rtc

websocket_urlpatterns = [
    re_path(r'ws/rtc/', rtc.RtcConsumer.as_asgi()),
    re_path(r'ws/', consumers.MessengerConsumer.as_asgi()),
]