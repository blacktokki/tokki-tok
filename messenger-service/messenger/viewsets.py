from copy import deepcopy
from itertools import chain
from collections import defaultdict
from rest_framework import viewsets
from rest_framework.decorators import action

from messenger.consumers import send_delete_message, send_enter, send_leave, send_next_message
from notifications import send_notification_message
from .serializers import (
    ChannelSerializer,
    DirectChannelSerializer,
    MessengerChannelSerializer,
    MessengerContentSerializer,
    MessengerMemberSerializer,
    MessengerUserBulkSerializer,
    MessengerUserSerializer,
    MessageSerializer
)
from .filtersets import ChannelFilterSet, ChannelContentFilterSet, MessengerMemberFilterSet
from .models import Message, Channel, MessengerMember, ChannelContent


def post_create_messages(message_ids):
    notification_messages = defaultdict(list)
    for instance in ChannelContent.objects.messenger_content_filter(message__id__in=message_ids):
        serializer = MessengerContentSerializer(instance=instance)
        send_next_message(instance.channel_id, serializer.data)
        notification_messages[instance.channel_id].append(serializer.data)
    for channel in Channel.objects.channel_with_notifications(notification_messages.keys()):
        notifications_chain = chain(*[mm.user.notification_set.all() for mm in channel.messengermember_set.all()])
        for data in notification_messages[channel.id]:
            notifications = [n for n in deepcopy(notifications_chain) if n.user_id != data['user']]
            send_notification_message(notifications, data)


def post_enter_channel(channel, user_ids, message_ids):
    send_enter(channel, user_ids)
    post_create_messages(message_ids)


# Create your views here.
class ChannelViewSet(viewsets.ModelViewSet):
    serializer_class = ChannelSerializer
    filterset_class = ChannelFilterSet
    queryset = Channel.objects.all()

    @action(detail=False, methods=['get'],
            queryset=Channel.objects.annotate_viewset(),
            serializer_class=MessengerChannelSerializer)
    def messenger(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=['post'], url_path='direct', serializer_class=DirectChannelSerializer)
    def direct_messenger(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save()
        if serializer.data['type'] == 'messenger':
            post_enter_channel(serializer.instance, serializer.data['enter_users'], serializer.data['enter_messages'])

    def perform_destroy(self, instance):
        id = instance.id
        _type = instance.type
        instance.delete()
        if _type == "messenger":
            send_leave(id)


class MessengerContentViewset(viewsets.ModelViewSet):
    serializer_class = MessengerContentSerializer
    filterset_class = ChannelContentFilterSet
    queryset = ChannelContent.objects.annotate_messenger_viewset()

    @action(detail=False, methods=['post'],
            queryset=Message.objects.all(),
            serializer_class=MessageSerializer)
    def messages(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        post_create_messages([response.data['id']])
        return response

    @action(detail=True, methods=['patch'],
            queryset=Message.objects.all(),
            serializer_class=MessageSerializer,
            filter_backends=[])
    def message(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def perform_destroy(self, instance):
        channel_id = instance.channel_id
        content_id = instance.id
        instance.delete()
        send_delete_message(channel_id, content_id)


class MessengerMemberViewset(viewsets.ModelViewSet):
    serializer_class = MessengerMemberSerializer
    filterset_class = MessengerMemberFilterSet
    queryset = MessengerMember.objects.all()

    @action(detail=False, methods=['get'],
            queryset=MessengerMember.objects.select_related('user'),
            serializer_class=MessengerUserSerializer)
    def user(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=['post'], url_path='bulk', serializer_class=MessengerUserBulkSerializer)
    def bulk_create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        channel = Channel.objects.get(id=response.data["channel"])
        post_enter_channel(channel, response.data["user_ids"], response.data["enter_message_ids"])
        return response

    def perform_destroy(self, instance):
        user_id = instance.user_id
        channel = instance.channel
        instance.delete()
        if channel.owner_id == user_id or channel.subowner_id == user_id:
            channel.owner_id = channel.owner_id if channel.owner_id != user_id else channel.subowner_id
            subowner = MessengerMember.objects.filter(channel_id=channel.id).exclude(user_id=channel.owner_id).first()
            channel.subowner = subowner.user if subowner else None
            channel.save()
        send_leave(channel.id, user_id)
        serializer = MessageSerializer(data={"channel": channel.id, "content": f"{instance.user.name} 퇴장"})
        serializer.is_valid()
        serializer.save()
        post_create_messages([serializer.data['id']])
        if not MessengerMember.objects.filter(channel_id=channel.id).exists():
            channel.delete()
