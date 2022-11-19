import django_filters
from .models import Channel, ChannelContent, MessengerMember


class ChannelFilterSet(django_filters.FilterSet):
    messenger_user_id = django_filters.NumberFilter(label='messenger_user_id', field_name='messengermember__user_id')

    class Meta:
        model = Channel
        fields = '__all__'


class ChannelContentFilterSet(django_filters.FilterSet):
    class Meta:
        model = ChannelContent
        fields = '__all__'


class MessengerMemberFilterSet(django_filters.FilterSet):
    class Meta:
        model = MessengerMember
        fields = '__all__'