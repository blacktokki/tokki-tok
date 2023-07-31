import django_filters
from .models import Channel, ChannelContent, MessengerMember


class ChannelFilterSet(django_filters.FilterSet):
    messenger_user_id = django_filters.NumberFilter(
        label='messenger_user_id', field_name='messengermember__user_id', help_text="사용자 id")

    class Meta:
        model = Channel
        fields = '__all__'


class ChannelContentFilterSet(django_filters.FilterSet):
    def __init__(self, *args, **kwargs):
        if 'with_archive' not in kwargs['data']:
            kwargs['data'] = kwargs['data'].copy()
            kwargs['data']['with_archive'] = 'false'
        super().__init__(*args, **kwargs)

    id_lt = django_filters.NumberFilter(field_name='id', lookup_expr='lt', help_text="지정값보다 작은 id")
    timer_gt = django_filters.DateTimeFilter(field_name='timer', lookup_expr='gt', help_text='지정시간 이후의 타이머')
    updated_gte = django_filters.DateTimeFilter(field_name='updated', lookup_expr='gte', help_text='지정시간 이후의 수정시간')
    with_archive = django_filters.BooleanFilter(method='with_archive_filter', help_text='비활성 컨텐츠 포함 여부')

    class Meta:
        model = ChannelContent
        fields = '__all__'

    def with_archive_filter(self, queryset, name, value):
        return queryset if value else queryset.filter(is_archive=False)


class MessengerMemberFilterSet(django_filters.FilterSet):
    class Meta:
        model = MessengerMember
        fields = '__all__'
