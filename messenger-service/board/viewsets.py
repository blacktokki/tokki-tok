from django.db import models
from rest_framework import viewsets
from rest_framework.decorators import action
from board.models import Board

from board.serializers import BoardContentSerializer, BoardSerializer
from messenger.filtersets import ChannelContentFilterSet
from messenger.models import ChannelContent


# Create your views here.
class BoardContentViewset(viewsets.ModelViewSet):
    serializer_class = BoardContentSerializer
    filterset_class = ChannelContentFilterSet
    queryset = ChannelContent.objects.filter(channel__type='board').annotate(
        name=models.F('user__last_name')).order_by('-id')

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
