from django.db import transaction
from rest_framework import serializers
from accounts.models import User
from accounts.serializers import UserSerializer
from .models import Board, Channel, MessengerMember, Message, ChannelContent


class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = '__all__'


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        exclude = ['channel_content']


class BoardSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(write_only=True, queryset=User.objects.all())
    channel = serializers.PrimaryKeyRelatedField(write_only=True, queryset=Channel.objects.filter(type='board'))

    @transaction.atomic
    def create(self, validated_data):
        user = validated_data.pop("user")
        channel = validated_data.pop("channel")
        validated_data['channel_content'] = ChannelContent.objects.create(user=user, channel=channel)
        return super().create(validated_data)

    class Meta:
        model = Board
        exclude = ['channel_content']


class MessengerContentSerializer(serializers.ModelSerializer):
    message_set = MessageSerializer(many=True, read_only=True)
    name = serializers.CharField(read_only=True)
    class Meta:
        model = ChannelContent
        fields = '__all__'


class BoardContentSerializer(serializers.ModelSerializer):
    board_set = BoardSerializer(many=True, read_only=True)
    message_set = MessageSerializer(many=True, read_only=True)
    name = serializers.CharField(read_only=True)
    class Meta:
        model = ChannelContent
        fields = '__all__'


class MessengerMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessengerMember
        fields = '__all__'


class MessengerUserSerializer(MessengerMemberSerializer):
    user = UserSerializer()
    class Meta:
        model = MessengerMember
        fields = '__all__'