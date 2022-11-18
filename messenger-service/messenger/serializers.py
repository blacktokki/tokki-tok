from rest_framework import serializers
from accounts.serializers import UserSerializer
from .models import Board, Channel, MessengerMember, Message, ChannelContent


class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = '__all__'


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = '__all__'


class MessengerContentSerializer(serializers.ModelSerializer):
    message_set = MessageSerializer(many=True)
    class Meta:
        model = ChannelContent
        fields = '__all__'


class BoardContentSerializer(serializers.ModelSerializer):
    board_set = MessageSerializer(many=True)
    message_set = MessageSerializer(many=True)
    class Meta:
        model = ChannelContent
        fields = '__all__'


class MessengerMemberSerializer(serializers.Serializer):
    user = UserSerializer()
    class Meta:
        model = MessengerMember
        fields = '__all__'
