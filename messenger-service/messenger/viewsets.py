from rest_framework import viewsets
from rest_framework.decorators import action

from .serializers import (
    ChannelSerializer,
    DirectChannelSerializer,
    MessengerChannelSerializer,
    MessengerContentSerializer,
    MessengerMemberSerializer,
    MessengerUserBulkSerializer,
    MessengerUserSerializer,
    MessageSerializer,
)
from .filtersets import ChannelFilterSet, ChannelContentFilterSet, MessengerMemberFilterSet
from .models import Message, Channel, MessengerMember, ChannelContent


# Create your views here.
class ChannelViewSet(viewsets.ModelViewSet):
    serializer_class = ChannelSerializer
    filterset_class = ChannelFilterSet
    queryset = Channel.objects.all()

    @action(detail=False, methods=['get'],
            queryset=Channel.objects.annotate_viewset(),
            serializer_class=MessengerChannelSerializer)
    def messenger(self, request, *args, **kwargs):
        """
        상세 정보가 포함된 채널 목록 조회
        """
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=['post'], url_path='direct', serializer_class=DirectChannelSerializer)
    def direct_messenger(self, request, *args, **kwargs):
        """
        1:1 메신저 채널 생성
        """
        return super().create(request, *args, **kwargs)


class MessengerContentViewset(viewsets.ModelViewSet):
    serializer_class = MessengerContentSerializer
    filterset_class = ChannelContentFilterSet
    queryset = ChannelContent.objects.annotate_messenger_viewset()

    @action(detail=False, methods=['post'], queryset=Message.objects.all(), serializer_class=MessageSerializer)
    def messages(self, request, *args, **kwargs):
        """
        메시지 컨텐츠 생성
        """
        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=['patch'],
            queryset=Message.objects.all(),
            serializer_class=MessageSerializer,
            filter_backends=[])
    def message(self, request, *args, **kwargs):
        """
        메시지 컨텐츠 수정
        """
        return super().partial_update(request, *args, **kwargs)


class MessengerMemberViewset(viewsets.ModelViewSet):
    serializer_class = MessengerMemberSerializer
    filterset_class = MessengerMemberFilterSet
    queryset = MessengerMember.objects.all()

    @action(detail=False, methods=['get'],
            queryset=MessengerMember.objects.select_related('user'),
            serializer_class=MessengerUserSerializer)
    def user(self, request, *args, **kwargs):
        """
        상세 정보가 포함된 참가자 목록 조회
        """
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=['post'], url_path='bulk', serializer_class=MessengerUserBulkSerializer)
    def bulk_create(self, request, *args, **kwargs):
        """
        채널 일괄 입장
        """
        return super().create(request, *args, **kwargs)
