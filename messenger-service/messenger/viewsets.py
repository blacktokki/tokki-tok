from django.db import models
from rest_framework import viewsets
from rest_framework.decorators import action
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from messenger.consumers import CHANNEL_PREFIX, GROUP_PREFIX
from .serializers import (
    BoardContentSerializer, 
    ChannelSerializer, 
    MessengerContentSerializer, 
    MessengerMemberSerializer, 
    MessengerUserSerializer, 
    BoardSerializer,
    MessageSerializer
)
from .filtersets import ChannelFilterSet, ChannelContentFilterSet, MessengerMemberFilterSet
from .models import Board, Message, Channel, MessengerMember, ChannelContent


# Create your views here.
class ChannelViewSet(viewsets.ModelViewSet):
    serializer_class = ChannelSerializer
    filterset_class = ChannelFilterSet
    queryset = Channel.objects.all()

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        if response.data['type'] == 'messenger':
            async_to_sync(get_channel_layer().group_send)(f"{GROUP_PREFIX}{response.data['group']}", {"type": "enter", "data": {
                "channel_id": response.data["id"],
                "user_ids": [response.data["owner"]]
            }})
        return response

    def perform_destroy(self, instance):
        id = instance.id
        _type = instance.type
        instance.delete()
        if _type == "messenger":
            async_to_sync(get_channel_layer().group_send)(f"{CHANNEL_PREFIX}{id}", {"type": "leave", "data": {
                "channel_id": id,
            }})


class MessengerContentViewset(viewsets.ModelViewSet):
    serializer_class = MessengerContentSerializer
    filterset_class = ChannelContentFilterSet
    queryset = ChannelContent.objects.filter(channel__type='messenger').annotate(name=models.F('user__last_name')).order_by('-id')

    @action(detail=False, methods=['post'], 
        queryset=Message.objects.all(),
        serializer_class=MessageSerializer)
    def messages(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        serializer = MessengerContentSerializer(instance=ChannelContent.objects.annotate(name=models.F('user__last_name')).get(message__id=response.data["id"]))
        async_to_sync(get_channel_layer().group_send)(f"{CHANNEL_PREFIX}{request.data['channel']}", {"type": "next_message", "data": serializer.data})
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

    def perform_destroy(self, instance):
        channel = instance.channel
        instance.delete()
        if not MessengerMember.objects.filter(channel=channel).exists():
            channel.delete()
