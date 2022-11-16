from rest_framework import viewsets
from .serializers import MembershipSerializer, GroupSerializer
from .models import Membership, Group


# Create your views here.

class GroupViewSet(viewsets.ModelViewSet):
    serializer_class = GroupSerializer
    queryset = Group.objects.all()


class MembershipViewSet(viewsets.ModelViewSet):
    serializer_class = MembershipSerializer
    queryset = Membership.objects.all().select_related('user')
