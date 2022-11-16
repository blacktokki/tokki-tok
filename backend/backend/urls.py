from django.contrib import admin
from django.shortcuts import redirect
from django.urls import path
from django.conf.urls import url, include
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
import account.viewsets as account_api
import messenger.viewsets as messenger_api


router = routers.DefaultRouter()
router.register('memberships', account_api.MembershipViewSet)
router.register('groups', account_api.GroupViewSet)
router.register('channels', messenger_api.ChannelViewSet)
router.register('messages', messenger_api.MessageViewset)
router.register('boards', messenger_api.BoardViewset)
router.register('messengermembers', messenger_api.MessengerMemberViewset)

api_patterns = [
    url(r'^api/v1/', include(router.urls))
]

urlpatterns = api_patterns + [
    url(r'^admin/', admin.site.urls),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api/v1/doc/', include_docs_urls(title='Messenger API', public=False, patterns=api_patterns)),
    url(r'^', lambda request: redirect('/api/v1/'))
]
