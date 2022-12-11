from django.db import models
from rest_framework import viewsets
from rest_framework.decorators import action

from messenger.consumers import send_enter, send_leave, send_next_message
from .serializers import (
    BoardContentSerializer, 
    ChannelSerializer,
    MessengerChannelSerializer, 
    MessengerContentSerializer, 
    MessengerMemberSerializer,
    MessengerUserBulkSerializer, 
    MessengerUserSerializer, 
    BoardSerializer,
    MessageSerializer
)
from .filtersets import ChannelFilterSet, ChannelContentFilterSet, MessengerMemberFilterSet
from .models import Board, Message, Channel, MessengerMember, ChannelContent


def post_create_message(channel_id, message_ids):
    for instance in ChannelContent.objects.annotate(name=models.F('user__last_name')).filter(message__id__in=message_ids):
        serializer = MessengerContentSerializer(instance=instance)
        send_next_message(channel_id, serializer.data)


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

    def perform_create(self, serializer):
        serializer.save()
        if serializer.data['type'] == 'messenger':
            send_enter(serializer.instance, serializer.data["owner"])
            post_create_message(serializer.data["id"], [serializer.data['enter_message_id']])


    def perform_destroy(self, instance):
        id = instance.id
        _type = instance.type
        instance.delete()
        if _type == "messenger":
            send_leave(id)
            

class MessengerContentViewset(viewsets.ModelViewSet):
    serializer_class = MessengerContentSerializer
    filterset_class = ChannelContentFilterSet
    queryset = ChannelContent.objects.filter(channel__type='messenger').annotate(name=models.F('user__last_name')).order_by('-id')

    @action(detail=False, methods=['post'], 
        queryset=Message.objects.all(),
        serializer_class=MessageSerializer)
    def messages(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        post_create_message(request.data['channel'], [response.data['id']])
        return response

    @action(detail=True, methods=['patch'],
        queryset=Board.objects.all(),
        serializer_class=MessageSerializer,
        filter_backends=[])
    def message(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)


class BoardContentViewset(viewsets.ModelViewSet):
    serializer_class = BoardContentSerializer
    filterset_class = ChannelContentFilterSet
    queryset = ChannelContent.objects.filter(channel__type='board').annotate(name=models.F('user__last_name')).order_by('-id')

    @action(detail=False, methods=['post'], 
        queryset=Board.objects.all(),
        serializer_class=BoardSerializer)
    def boards(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=['patch'],
        queryset=Board.objects.all(),
        serializer_class=BoardSerializer,
        filter_backends=[])
    def board(self, request, *args, **kwargs):
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
