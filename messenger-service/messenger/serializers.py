from django.db import transaction
from rest_framework import serializers
from accounts.models import User
from accounts.serializers import UserSerializer
from .models import Board, Channel, MessengerMember, Message, ChannelContent


def create_enter_message(channel_id, user):
    channel_content = ChannelContent.objects.create(channel_id=channel_id)
    return Message.objects.create(channel_content=channel_content, content=f'{user.name} 입장')


class ChannelSerializer(serializers.ModelSerializer):
    enter_message_id = serializers.CharField(read_only=True)

    @transaction.atomic
    def create(self, validated_data):
       result = super().create(validated_data)
       if validated_data['type'] == 'messenger':
            validated_data['enter_message_id'] = create_enter_message(validated_data['id'], validated_data['owner']).id
       return result 
    
    class Meta:
        model = Channel
        fields = '__all__'


class LastMessageSerializer(serializers.Serializer):
    created = serializers.DateTimeField(source='channel_content__created', read_only=True)
    content = serializers.CharField(read_only=True)


class MessengerChannelSerializer(serializers.ModelSerializer):
    last_message_id = serializers.HiddenField(default=None)
    last_message = LastMessageSerializer(required=False)
    member_count = serializers.IntegerField(read_only=True)
    unread_count = serializers.IntegerField(read_only=True)

    def to_representation(self, instance):
        if not hasattr(self, '_last_message'):
            _last_message = [i.last_message_id for i in self.parent.instance] if self.parent else [self.instance.last_message_id]
            self._last_message = {i['channel_content__channel_id']:i for i in Message.objects.filter(channel_content_id__in=_last_message).values('channel_content__channel_id', 'channel_content__created', 'content')}
        data = super().to_representation(instance)
        data['last_message'] = LastMessageSerializer(instance=self._last_message[data['id']]).data if data['id'] in self._last_message else None
        return data

    class Meta:
        model = Channel
        fields = '__all__'


class MessageSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(write_only=True, required=False, queryset=User.objects.all())
    channel = serializers.PrimaryKeyRelatedField(write_only=True, queryset=Channel.objects.filter(type='messenger'))

    @transaction.atomic
    def create(self, validated_data):
        user = validated_data.pop("user", None)
        channel = validated_data.pop("channel")
        validated_data['channel_content'] = ChannelContent.objects.create(user=user, channel=channel)
        return super().create(validated_data)

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


class MessengerUserBulkSerializer(MessengerMemberSerializer):
    user_ids = serializers.ListField(child=serializers.IntegerField())
    user = serializers.HiddenField(default=None)
    enter_message_ids = serializers.ListField(child=serializers.CharField(), read_only=True)

    @transaction.atomic
    def create(self, validated_data):
        user_ids = validated_data.pop("user_ids")
        members = [MessengerMember(user_id=user_id, **validated_data) for user_id in user_ids]
        MessengerMember.objects.bulk_create(members)
        validated_data['enter_message_ids'] = [
            create_enter_message(validated_data['channel'].id, user).id
            for user in User.objects.filter(id__in=user_ids)
        ]
        validated_data["user_ids"] = user_ids
        return validated_data
    class Meta:
        model = MessengerMember
        fields = '__all__'