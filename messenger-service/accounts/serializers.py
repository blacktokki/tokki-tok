from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(read_only=True, help_text='이름')

    class Meta:
        model = User
        exclude = ['password', 'groups', 'user_permissions', 'first_name', 'last_name']

