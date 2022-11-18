import django_filters
from .models import Group, User


class UserFilterSet(django_filters.FilterSet):
    _self = django_filters.BooleanFilter(method='self_filter', help_text='self')

    class Meta:
        model = User
        exclude = ['password', 'groups', 'user_permissions']

    def self_filter(self, queryset, name, value):
        return queryset.filter(id=self.request.user.id)


class GroupFilterSet(django_filters.FilterSet):
    _self = django_filters.BooleanFilter(method='self_filter', help_text='self')

    def self_filter(self, queryset, name, value):
        return queryset.filter(membership__user_id=self.request.user.id, root_id__isnull=True)

    class Meta:
        model = Group
        fields = '__all__'