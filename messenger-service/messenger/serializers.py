import re
from copy import deepcopy
from itertools import chain
from collections import defaultdict
from opengraph_parse import parse_page
from django.db import transaction
from django.db.models.signals import post_delete
from django.utils.html import strip_tags
from rest_framework import serializers
from accounts.models import User
from accounts.serializers import UserSerializer
from notifications import send_notification_message
from .consumers import send_update_message, send_enter, send_leave, send_next_message
from .models import Channel, MessengerMember, Message, ChannelContent, Attatchment

url_extract_pattern = "https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)"  # noqa E501


def attach_link(channel_content, validated_data):
    """
    link 컨텐츠 추가
    """
    link_set = set(re.findall(url_extract_pattern, validated_data['content']))
    add_links = []
    delete_link_ids = []
    for link in channel_content.attatchment_set.filter(type='link'):
        if link.url not in link_set:
            delete_link_ids.append(link.id)
        else:
            link_set.remove(link.url)
    for url in link_set:
        parsed_og_tags = parse_page(url, [
            "og:url", "og:title", "og:image", "og:description"], fallback_tags={'og:title': 'title'})
        if parsed_og_tags:
            add_links.append(Attatchment(
                channel_content=channel_content,
                type='link',
                url=parsed_og_tags.get("og:url", url),
                title=parsed_og_tags.get("og:title"),
                image_url=parsed_og_tags.get("og:image"),
                description=parsed_og_tags.get("og:description")
            ))
    Attatchment.objects.filter(id__in=delete_link_ids).delete()
    Attatchment.objects.bulk_create(add_links)


def post_create_messages(message_ids):
    """
    메시지 생성후 알림
    """
    notification_messages = defaultdict(list)
    for instance in ChannelContent.objects.messenger_content_filter(message__id__in=message_ids):
        serializer = MessengerContentSerializer(instance=instance)
        send_next_message(instance.channel_id, serializer.data)
        notification_messages[instance.channel_id].append(serializer.data)
    for channel in Channel.objects.channel_with_notifications(notification_messages.keys()):
        notifications_chain = chain(*[mm.user.notification_set.all() for mm in channel.messengermember_set.all()])
        for data in notification_messages[channel.id]:
            notifications = [n for n in deepcopy(notifications_chain) if n.user_id != data['user']]
            send_notification_message(notifications, data)


def post_enter_channel(channel, users):
    """
    채널 입장후 알림
    """
    user_ids = []
    message_ids = []
    for user in users:
        channel_content = ChannelContent.objects.create(channel=channel)
        user_ids.append(user.id)
        message_ids.append(Message.objects.create(channel_content=channel_content, content=f'{user.name} 입장').id)
    send_enter(user_ids, ChannelSerializer(instance=channel).data)
    post_create_messages(message_ids)


def post_leave_channel(channel, user):
    """
    채널 퇴장후 알림
    """
    channel.save_pop_owners(user.id)
    send_leave(channel.id, user.id)
    if not channel.is_archive:
        channel_content = ChannelContent.objects.create(channel=channel)
        message_id = Message.objects.create(channel_content=channel_content, content=f'{user.name} 퇴장').id
        post_create_messages([message_id])


post_delete.connect(
    lambda sender, instance, **kwargs: post_leave_channel(instance.channel, instance.user), sender=MessengerMember)


class ChannelSerializer(serializers.ModelSerializer):
    def _enter_channel(self, instance, user):
        MessengerMember.objects.create(user_id=user.id, channel=instance)
        post_enter_channel(instance, [user])

    @transaction.atomic
    def create(self, validated_data):
        instance = super().create(validated_data)
        if instance.type == 'messenger':
            self._enter_channel(instance, validated_data['owner'])
            if 'subowner' in validated_data and not validated_data['owner'].id != validated_data['subowner'].id:
                self._enter_channel(instance, validated_data['subowner'])
        return instance

    class Meta:
        model = Channel
        fields = '__all__'


class DirectChannelSerializer(ChannelSerializer):
    @transaction.atomic
    def create(self, validated_data):
        instance = Channel.objects.filter_direct_channel(validated_data['owner'], validated_data.get('subowner'))
        if instance:
            instance.enter_message_id = None
            instance.subowner_message_id = None
        else:
            instance = super().create(validated_data)
        return instance

    class Meta:
        model = Channel
        fields = '__all__'


class LastMessageSerializer(serializers.Serializer):
    created = serializers.DateTimeField(source='channel_content__created', read_only=True)
    content = serializers.CharField(read_only=True, help_text='마지막 메시지 내용')
    preview_content = serializers.CharField(read_only=True, help_text='마지막 메시지 미리보기 내용')


class MessengerChannelSerializer(serializers.ModelSerializer):
    last_message_id = serializers.HiddenField(default=None)
    last_message = LastMessageSerializer(read_only=True, required=False)
    member_count = serializers.IntegerField(read_only=True, help_text='채널 참가자 수')
    unread_count = serializers.IntegerField(read_only=True, help_text='안읽음 메시지 수')
    owner = UserSerializer(read_only=True)
    subowner = UserSerializer(read_only=True)

    def to_representation(self, instance):
        if not hasattr(self, '_last_message'):
            _last_message = [i.last_message_id for i in self.parent.instance] if self.parent else [
                self.instance.last_message_id]
            self._last_message = {i['channel_content__channel_id']: i for i in Message.objects.last_message_values(
                _last_message)}
        data = super().to_representation(instance)
        data['last_message'] = LastMessageSerializer(
            instance=self._last_message[data['id']]).data if data['id'] in self._last_message else None
        return data

    class Meta:
        model = Channel
        fields = '__all__'


class MessageSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        write_only=True, required=False, queryset=User.objects.all(), help_text='작성자 id')
    channel = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Channel.objects.filter(type='messenger'), help_text='채널')
    timer = serializers.DateTimeField(required=False, write_only=True, help_text='타이머 메시지 종료시점')
    file = serializers.FileField(required=False, write_only=True, help_text='첨부파일')

    @transaction.atomic
    def create(self, validated_data):
        user = validated_data.pop("user", None)
        channel = validated_data.pop("channel")
        timer = validated_data.pop("timer", None)
        file = validated_data.pop("file", None)
        validated_data['channel_content'] = ChannelContent.objects.create(user=user, channel=channel, timer=timer)
        attach_link(validated_data['channel_content'], validated_data)
        if file:
            attatchment = Attatchment.objects.create(
                type='file', channel_content=validated_data['channel_content'], file=file)
            validated_data['preview_content'] = attatchment.filename
        if validated_data.get('use_editor'):
            validated_data['preview_content'] = strip_tags(validated_data.get('content', ''))[:128]
        instance = super().create(validated_data)
        post_create_messages([instance.id])
        return instance

    class Meta:
        model = Message
        exclude = ['channel_content']


class AttatchmentSerializer(serializers.ModelSerializer):
    filename = serializers.CharField(read_only=True, help_text='파일명')
    filesize = serializers.IntegerField(read_only=True, help_text='파일크기(byte)')
    thumbnail = serializers.CharField(read_only=True, help_text='썸네일')

    class Meta:
        model = Attatchment
        exclude = ['channel_content']


class MessengerContentSerializer(serializers.ModelSerializer):
    message_set = MessageSerializer(many=True, read_only=True)
    attatchment_set = AttatchmentSerializer(many=True, read_only=True)
    name = serializers.CharField(read_only=True, help_text='작성자 이름')
    channel_name = serializers.CharField(read_only=True, help_text='채널 이름')

    @transaction.atomic
    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        send_update_message(instance.channel_id, self.data)
        return instance

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
    user_ids = serializers.ListField(child=serializers.IntegerField(), help_text='참가자 id 목록')
    user = serializers.HiddenField(default=None)
    enter_message_ids = serializers.ListField(child=serializers.CharField(), read_only=True, help_text='입장 메시지 목록')

    @transaction.atomic
    def create(self, validated_data):
        user_ids = validated_data.pop("user_ids")
        members = [MessengerMember(user_id=user_id, **validated_data) for user_id in user_ids]
        validated_data["user_ids"] = user_ids
        MessengerMember.objects.bulk_create(members)
        users = User.objects.filter(id__in=user_ids)
        channel = validated_data['channel']
        if channel.subowner is None:
            channel.subowner_id = ([i for i in user_ids if i != channel.owner_id] + [None])[0]
            channel.save()
        elif len(channel.name) == 0:
            channel.name = f"{channel.owner.name},{channel.subowner.name}..."
            channel.save()
        post_enter_channel(channel, users)
        return validated_data

    class Meta:
        model = MessengerMember
        fields = '__all__'
