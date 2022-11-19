import django_filters
from .models import User


class UserFilterSet(django_filters.FilterSet):
    name =django_filters.CharFilter(field_name='last_name', label='name', help_text='name')
    _self = django_filters.BooleanFilter(method='self_filter', label='self', help_text='self')
    group_id = django_filters.NumberFilter(field_name='membership__group_id', label='group_id')

    class Meta:
        model = User
        exclude = ['password', 'groups', 'user_permissions', 'first_name', 'last_name']

    def self_filter(self, queryset, name, value):
        return queryset.filter(id=self.request.user.id)

