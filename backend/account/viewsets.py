from argparse import Action
from rest_framework import viewsets

from account.filtersets import  UserFilterSet
from .serializers import UserSerializer
from .models import User

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    filterset_class = UserFilterSet
    queryset = User.objects.all()
