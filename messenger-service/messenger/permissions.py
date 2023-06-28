from functools import singledispatchmethod
from rest_framework.permissions import BasePermission
from .models import Channel, ChannelContent, Message, MessengerMember


class MessengerPermission(BasePermission):
    def has_permission(self, request, view):
        if view.detail is False:
            if request.method == 'GET':
                return self.has_data_permission(request, view, request.query_params)
            elif request.method == 'POST':
                return self.has_data_permission(request, view, request.data)
        return super().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        return self._has_object_permission(obj, request)

    def has_data_permission(self, request, view, data):
        for k, v in data.items():
            if k in ['channel'] and not MessengerMember.objects.is_entered(int(v), request.user.id):
                return False
            if k in ['owner', 'messenger_user_id'] and int(v) != request.user.id:
                return False
        return True

    @singledispatchmethod
    def _has_object_permission(self, obj, request):
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
        return obj.user == request.user
