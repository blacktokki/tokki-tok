import re
from opengraph_parse import parse_page
from django.db import transaction
from rest_framework import serializers
from accounts.models import User
from accounts.serializers import UserSerializer
from .models import Board, Channel, MessengerMember, Message, ChannelContent, Link

url_extract_pattern = "https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)"


def create_enter_message(channel_id, user):
    channel_content = ChannelContent.objects.create(channel_id=channel_id)
    return Message.objects.create(channel_content=channel_content, content=f'{user.name} 입장')


class ChannelSerializer(serializers.ModelSerializer):
    enter_message_id = serializers.CharField(read_only=True)

    @transaction.atomic
    def create(self, validated_data):
        instance = super().create(validated_data)
        if instance.type == 'messenger':
            MessengerMember.objects.create(user_id=validated_data['owner'].id, channel_id=instance.id)
            instance.enter_message_id = create_enter_message(instance.id, validated_data['owner']).id
        return instance
    
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
            self._last_message = {i['channel_content__channel_id']:i for i in Message.objects.filter(id__in=_last_message).values('channel_content__channel_id', 'channel_content__created', 'content')}
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


class LinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Link
        exclude = ['channel_content', 'parent_content']


class BoardSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(write_only=True, queryset=User.objects.all())
    channel = serializers.PrimaryKeyRelatedField(write_only=True, queryset=Channel.objects.filter(type='board'))

    @transaction.atomic
    def create(self, validated_data):
        user = validated_data.pop("user")
        channel = validated_data.pop("channel")
        validated_data['channel_content'] = ChannelContent.objects.create(user=user, channel=channel)
        self.attach_link(validated_data['channel_content'], validated_data)
        return super().create(validated_data)

    @transaction.atomic
    def update(self, instance, validated_data):
        self.attach_link(instance.channel_content, validated_data)
        return super().update(instance, validated_data)

    def attach_link(self, channel_content, validated_data):
        link_set = set(re.findall(url_extract_pattern, validated_data['content']))
        add_links = []
        delete_link_ids = []
        for link in channel_content.link_set.all():
            if link.url not in link_set:
                delete_link_ids.append(link.id)
            else:
                link_set.pop(link.url)
        for url in link_set:
            parsed_og_tags = parse_page(url, ["og:url", "og:title", "og:image", "og:description"])
            add_links.append(Link(
                channel_content=channel_content,
                url=parsed_og_tags.get("og:url"),
                title=parsed_og_tags.get("og:title"),
                image=parsed_og_tags.get("og:image"),
                description=parsed_og_tags.get("og:description")
            ))
        Link.objects.filter(id__in=delete_link_ids).delete()
        Link.objects.bulk_create(add_links)

    class Meta:
        model = Board
        exclude = ['channel_content']


class MessengerContentSerializer(serializers.ModelSerializer):
    message_set = MessageSerializer(many=True, read_only=True)
    name = serializers.CharField(read_only=True)
    channel_name = serializers.CharField(read_only=True)
    class Meta:
        model = ChannelContent
        fields = '__all__'


class BoardContentSerializer(serializers.ModelSerializer):
    board_set = BoardSerializer(many=True, read_only=True)
    message_set = MessageSerializer(many=True, read_only=True)
    link_set = LinkSerializer(many=True, read_only=True)
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