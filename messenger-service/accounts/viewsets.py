from rest_framework import viewsets
from rest_framework.decorators import action

from accounts.filtersets import UserFilterSet
from .serializers import UserSerializer, UserMembershipSerializer
from .models import User


# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    filterset_class = UserFilterSet
    queryset = User.objects.all()

    @action(detail=False, methods=['get'],
            queryset=User.objects.annotate_membership_set(),
            serializer_class=UserMembershipSerializer)
    def memberships(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
