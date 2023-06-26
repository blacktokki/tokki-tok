import django_filters
from .models import Channel, ChannelContent, MessengerMember


class ChannelFilterSet(django_filters.FilterSet):
    messenger_user_id = django_filters.NumberFilter(label='messenger_user_id', field_name='messengermember__user_id')

    class Meta:
        model = Channel
        fields = '__all__'


class ChannelContentFilterSet(django_filters.FilterSet):
    def __init__(self, *args, **kwargs):
        if 'with_archive' not in kwargs['data']:
            kwargs['data'] = kwargs['data'].copy()
            kwargs['data']['with_archive'] = 'false'
        super().__init__(*args, **kwargs)
        # if self.form.initial.get('with_archive') is None:
        #     self.form.initial['with_archive'] = False
        # print(self.form.__dict__)

    id_lt = django_filters.NumberFilter(field_name='id', lookup_expr='lt')
    timer_gt = django_filters.DateTimeFilter(field_name='timer', lookup_expr='gt')
    updated_gte = django_filters.DateTimeFilter(field_name='updated', lookup_expr='gte')
    with_archive = django_filters.BooleanFilter(method='with_archive_filter')

    class Meta:
        model = ChannelContent
        fields = '__all__'

    def with_archive_filter(self, queryset, name, value):
        return queryset if value else queryset.filter(is_archive=False)


class MessengerMemberFilterSet(django_filters.FilterSet):
    class Meta:
        model = MessengerMember
        fields = '__all__'
