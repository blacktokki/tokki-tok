from django.db import models
from rest_framework import viewsets
from rest_framework.decorators import action
from .serializers import (
    BoardContentSerializer, 
    ChannelSerializer, 
    MessengerContentSerializer, 
    MessengerMemberSerializer, 
    MessengerUserSerializer, 
    BoardSerializer
)
from .filtersets import ChannelFilterSet, ChannelContentFilterSet, MessengerMemberFilterSet
from .models import Board, Channel, MessengerMember, ChannelContent


# Create your views here.
class ChannelViewSet(viewsets.ModelViewSet):
    serializer_class = ChannelSerializer
    filterset_class = ChannelFilterSet
    queryset = Channel.objects.all()


class MessageContentViewset(viewsets.ModelViewSet):
    serializer_class = MessengerContentSerializer
    filterset_class = ChannelContentFilterSet
    queryset = ChannelContent.objects.all().annotate(name=models.F('user__last_name'))


class BoardContentViewset(viewsets.ModelViewSet):
    serializer_class = BoardContentSerializer
    filterset_class = ChannelContentFilterSet
    queryset = ChannelContent.objects.all().annotate(name=models.F('user__last_name'))

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