from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.shortcuts import redirect
# from django.urls import path
from django.conf.urls import url, include
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
import accounts.viewsets as accounts_api
import messenger.viewsets as messenger_api
import notifications.viewsets as notification_api

router = routers.DefaultRouter()
router.register('users', accounts_api.UserViewSet)
router.register('channels', messenger_api.ChannelViewSet)
router.register('messengercontents', messenger_api.MessengerContentViewset, 'messengercontents')
router.register('messengermembers', messenger_api.MessengerMemberViewset)
router.register('notifications', notification_api.NotificationViewSet)

api_patterns = [
    url(r'^api/v1/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
urlpatterns = api_patterns + staticfiles_urlpatterns() + [
    url(r'^admin/', admin.site.urls),
    url(r'^api/v1/doc/', include_docs_urls(title='Messenger API', public=False, patterns=api_patterns)),
    url(r'^', lambda request: redirect('/api/v1/'))
]
