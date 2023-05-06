from opengraph_parse import parse_page
from django.db import transaction
from rest_framework import serializers
from accounts.models import User
from board.models import Board
from messenger.models import Channel
from messenger.models import ChannelContent
from messenger.serializers import LinkSerializer, MessageSerializer, attach_link


class BoardSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(write_only=True, queryset=User.objects.all())
    channel = serializers.PrimaryKeyRelatedField(write_only=True, queryset=Channel.objects.filter(type='board'))

    @transaction.atomic
    def create(self, validated_data):
        user = validated_data.pop("user")
        channel = validated_data.pop("channel")
        validated_data['channel_content'] = ChannelContent.objects.create(user=user, channel=channel)
        attach_link(validated_data['channel_content'], validated_data)
        return super().create(validated_data)

    @transaction.atomic
    def update(self, instance, validated_data):
        attach_link(instance.channel_content, validated_data)
        return super().update(instance, validated_data)

    class Meta:
        model = Board
        exclude = ['channel_content']


class BoardContentSerializer(serializers.ModelSerializer):
    board_set = BoardSerializer(many=True, read_only=True)
    message_set = MessageSerializer(many=True, read_only=True)
    link_set = LinkSerializer(many=True, read_only=True)
    name = serializers.CharField(read_only=True)
    class Meta:
        model = ChannelContent
        fields = '__all__'