from functools import singledispatchmethod
from rest_framework.permissions import BasePermission
from .models import Channel, ChannelContent, Message, MessengerMember


class MessageViewerPermission(BasePermission):
    def has_permission(self, request, view):
        if 'channel' in request.query_params:
            return Channel.objects.filter(id=request.query_params['channel'], use_viewer=True).exists()
        return False


class MessengerPermission(BasePermission):
    def has_permission(self, request, view):
        if hasattr(view, 'detail') and view.detail is False:
            if request.method == 'GET':
                return self._has_data_permission(request, view, request.query_params)
            elif request.method == 'POST':
                return self._has_data_permission(request, view, request.data)
        return super().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        return self._has_object_permission(obj, request)

    def _has_data_permission(self, request, view, data):
        """
        data내 key 기준으로 권한 체크
        """
        for k, v in data.items():
            if k in ['channel'] and not (request.path.startswith(
                    '/api/v1/messengermembers') or MessengerMember.objects.is_entered(int(v), request.user.id)):
                return False
            if k in ['owner', 'messenger_user_id'] and int(v) != request.user.id:
                return False
        return True

    @singledispatchmethod
    def _has_object_permission(self, obj, request):
        """
        obj의 model type에 따라 동적 권한 체크
        """
        return True

    @_has_object_permission.register(Channel)
    def _(self, obj, request):
        return MessengerMember.objects.is_entered(obj.id, request.user.id)

    @_has_object_permission.register(ChannelContent)
    def _(self, obj, request):
        return MessengerMember.objects.is_entered(obj.channel.id, request.user.id)

    @_has_object_permission.register(Message)
    def _(self, obj, request):
        return MessengerMember.objects.is_entered(obj.channel_content.channel.id, request.user.id)

    @_has_object_permission.register(MessengerMember)
    def _(self, obj, request):
        return obj.user == request.user or obj.channel.owner == request.user
