from collections import defaultdict
from django.db import models
from rest_framework import viewsets
from rest_framework.decorators import action

from messenger.consumers import send_enter, send_leave, send_next_message
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

ANNOTATE_MESSENGER_CONTENT = {
    'name': models.F('user__last_name'), 
    'channel_name': models.F('channel__name')
}

def post_create_message(channel_id, message_ids):
    notification_messages = defaultdict(list)
    for instance in ChannelContent.objects.annotate(**ANNOTATE_MESSENGER_CONTENT).filter(message__id__in=message_ids):
        serializer = MessengerContentSerializer(instance=instance)
        send_next_message(channel_id, serializer.data)
        notification_messages[channel_id].append(serializer.data)
    prefetch = models.Prefetch('messengermember_set', MessengerMember.objects.prefetch_related('user__notification_set').all())
    for channel in Channel.objects.prefetch_related(prefetch).filter(id__in=notification_messages.keys()):
        for data in notification_messages[channel_id]:
            notifications = []
            for mm in channel.messengermember_set.all():
                if mm.user_id == data['user']:
                    continue
                notifications += list(mm.user.notification_set.all())
            send_notification_message(notifications, data)

# Create your views here.
class ChannelViewSet(viewsets.ModelViewSet):
    serializer_class = ChannelSerializer
    filterset_class = ChannelFilterSet
    queryset = Channel.objects.all()

    @action(detail=False, methods=['get'], 
        queryset=Channel.objects.filter(type='messenger').annotate(
            member_count=models.Subquery( Channel.objects.filter(id=models.OuterRef('id')).annotate(member_count=models.Count('messengermember')).values('member_count')[:1]),
            unread_count=models.Count('channelcontent', filter=models.Q(channelcontent__message__id__gt=models.F('messengermember__last_message'))),
            last_message_id=models.Max('channelcontent__message'),
        ),
        serializer_class=MessengerChannelSerializer)
    def messenger(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=['post'], url_path='direct', serializer_class=DirectChannelSerializer)
    def direct_messenger(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save()
        if serializer.data['type'] == 'messenger':
            print(serializer.data)
            if serializer.data.get('enter_message_id'):
                send_enter(serializer.instance, serializer.data["owner"])
                post_create_message(serializer.data["id"], [serializer.data['enter_message_id']])
            if serializer.data.get('counterpart_message_id'):
                send_enter(serializer.instance, serializer.data["counterpart"])
                post_create_message(serializer.data["id"], [serializer.data['counterpart_message_id']])


    def perform_destroy(self, instance):
        id = instance.id
        _type = instance.type
        instance.delete()
        if _type == "messenger":
            send_leave(id)
            

class MessengerContentViewset(viewsets.ModelViewSet):
    serializer_class = MessengerContentSerializer
    filterset_class = ChannelContentFilterSet
    queryset = ChannelContent.objects.filter(channel__type='messenger').annotate(**ANNOTATE_MESSENGER_CONTENT).order_by('-id')

    @action(detail=False, methods=['post'], 
        queryset=Message.objects.all(),
        serializer_class=MessageSerializer)
    def messages(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        post_create_message(request.data['channel'], [response.data['id']])
        return response

    @action(detail=True, methods=['patch'],
        queryset=Message.objects.all(),
        serializer_class=MessageSerializer,
        filter_backends=[])
    def message(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)


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
        for user_id in response.data["user_ids"]:
            send_enter(channel, user_id)
        post_create_message(response.data["channel"], response.data["enter_message_ids"])
        return response

    def perform_destroy(self, instance):
        user_id = instance.user_id
        channel = instance.channel
        instance.delete()
        send_leave(channel.id, user_id)
        serializer = MessageSerializer(data={"channel": channel.id, "content": f"{instance.user.name} 퇴장"})
        serializer.is_valid()
        serializer.save()
        post_create_message(channel.id, [serializer.data['id']])
        if not MessengerMember.objects.filter(channel_id=channel.id).exists():
            channel.delete()
