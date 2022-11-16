from rest_framework import viewsets
from .serializers import BoardSerializer, ChannelSerializer, MessengerMemberSerializer, MessageSerializer
from .models import Board, Channel, ChannelContent, MessengerMember, Message


# Create your views here.

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