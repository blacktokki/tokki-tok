import django_filters
from .models import Notification


class ChannelFilterSet(django_filters.FilterSet):
    class Meta:
        model = Notification
        fields = '__all__'
