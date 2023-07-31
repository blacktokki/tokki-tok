from rest_framework import serializers
from .models import User, Membership


class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(read_only=True, help_text='이름')

    class Meta:
        model = User
        exclude = ['password', 'groups', 'user_permissions', 'first_name', 'last_name']


class MembershipUserSerializer(serializers.ModelSerializer):
    # parent_group_id = serializers.IntegerField(read_only=True)
    root_group_id = serializers.IntegerField(read_only=True, help_text='최상위그룹 id')
    image_url = serializers.CharField(read_only=True, help_text='프로필 이미지 URL')
    groupname = serializers.CharField(read_only=True, help_text='그룹명')

    class Meta:
        model = Membership
        exclude = ['user']


class UserMembershipSerializer(UserSerializer):
    membership_set = MembershipUserSerializer(many=True)

    class Meta:
        model = User
        exclude = UserSerializer.Meta.exclude
