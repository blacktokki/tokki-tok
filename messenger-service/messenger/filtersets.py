import django_filters
from .models import Channel, ChannelContent, MessengerMember


class ChannelFilterSet(django_filters.FilterSet):
    messenger_user_id = django_filters.NumberFilter(label='messenger_user_id', method='messenger_user_filter')

    class Meta:
        model = Channel
        fields = '__all__'

    def messenger_user_filter(self, queryset, name, value):
        return queryset.filter(messenger_member__user_id=value)


class ChannelContentFilterSet(django_filters.FilterSet):
    class Meta:
        model = ChannelContent
        fields = '__all__'


class MessengerMemberFilterSet(django_filters.FilterSet):
    class Meta:
        model = MessengerMember
        fields = '__all__'