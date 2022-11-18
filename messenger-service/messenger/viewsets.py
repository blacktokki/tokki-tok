from rest_framework import viewsets

from account.filtersets import GroupFilterSet
from account.models import Group
from .serializers import BoardSerializer, ChannelSerializer, ChannelGroupSerializer, MessengerMemberSerializer, MessageSerializer
from .models import Board, Channel, MessengerMember, Message


# Create your views here.
class ChannelGroupViewSet(viewsets.ModelViewSet):
    serializer_class = ChannelGroupSerializer
    filterset_class = GroupFilterSet
    queryset = Group.objects.all()


class ChannelViewSet(viewsets.ModelViewSet):
    serializer_class = ChannelSerializer
    queryset = Channel.objects.all()


class MessageViewset(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    queryset = Message.objects.all()


class BoardViewset(viewsets.ModelViewSet):
    serializer_class = BoardSerializer
    queryset = Board.objects.all()


class MessengerMemberViewset(viewsets.ModelViewSet):
    serializer_class = MessengerMemberSerializer
    queryset = MessengerMember.objects.all()