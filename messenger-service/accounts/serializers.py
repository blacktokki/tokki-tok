from rest_framework import serializers
from .models import User, Membership


class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(read_only=True)

    class Meta:
        model = User
        exclude = ['password', 'groups', 'user_permissions', 'first_name', 'last_name']


class MembershipUserSerializer(serializers.ModelSerializer):
    # parent_group_id = serializers.IntegerField(read_only=True)
    root_group_id = serializers.IntegerField(read_only=True)
    image_url = serializers.CharField(read_only=True)
    groupname = serializers.CharField(read_only=True)

    class Meta:
        model = Membership
        exclude = ['user']


class UserMembershipSerializer(UserSerializer):
    membership_set = MembershipUserSerializer(many=True)

    class Meta:
        model = User
        exclude = UserSerializer.Meta.exclude
