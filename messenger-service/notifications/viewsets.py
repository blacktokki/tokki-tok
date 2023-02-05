from rest_framework import viewsets

from .serializers import NotificationSerializer
from .filtersets import ChannelFilterSet
from .models import Notification


# Create your views here.
class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    filterset_class = ChannelFilterSet
    queryset = Notification.objects.all()
