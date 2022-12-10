from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.shortcuts import redirect
from django.urls import path
from django.conf.urls import url, include
from django.middleware.csrf import get_token
from django.http import HttpResponse
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token
import accounts.viewsets as accounts_api
import messenger.viewsets as messenger_api


router = routers.DefaultRouter()
router.register('users', accounts_api.UserViewSet)
router.register('channels', messenger_api.ChannelViewSet)
router.register('messengercontents', messenger_api.MessengerContentViewset, 'messengercontents')
router.register('boardcontents', messenger_api.BoardContentViewset)
router.register('messengermembers', messenger_api.MessengerMemberViewset)

api_patterns = [
    url(r'^api/v1/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api-token-auth/', obtain_jwt_token),
    url(r'^api-token-refresh/', refresh_jwt_token),
]

urlpatterns = api_patterns + staticfiles_urlpatterns() + [
    url(r'^admin/', admin.site.urls),
    url(r'^api/v1/doc/', include_docs_urls(title='Messenger API', public=False, patterns=api_patterns)),
    url(r'^csrf/', lambda request: HttpResponse(get_token(request))),
    url(r'^', lambda request: redirect('/api/v1/'))
]
