from rest_framework import viewsets

from .serializers import BoardContentSerializer, ChannelSerializer, MessengerContentSerializer, MessengerMemberSerializer
from .filtersets import ChannelFilterSet, ChannelContentFilterSet, MessengerMemberFilterSet
from .models import Board, Channel, MessengerMember, ChannelContent


# Create your views here.
class ChannelViewSet(viewsets.ModelViewSet):
    serializer_class = ChannelSerializer
    filterset_class = ChannelFilterSet
    queryset = Channel.objects.all()


class MessageViewset(viewsets.ModelViewSet):
    serializer_class = MessengerContentSerializer
    filterset_class = ChannelContentFilterSet
    queryset = ChannelContent.objects.all()


class BoardViewset(viewsets.ModelViewSet):
    serializer_class = BoardContentSerializer
    filterset_class = ChannelContentFilterSet
    queryset = ChannelContent.objects.all()


class MessengerMemberViewset(viewsets.ModelViewSet):
    serializer_class = MessengerMemberSerializer
    filterset_class = MessengerMemberFilterSet
    queryset = MessengerMember.objects.all()