import os
from django.db import models
from easy_thumbnails.fields import ThumbnailerField
from easy_thumbnails.exceptions import InvalidImageFormatError

from accounts.models import Group, User
from .manager import ChannelManager, ChannelContentManager, MessageManager, MessengerMemberManager


# Create your models here.
class Channel(models.Model):
    TYPES = (
        ('messenger', 'messenger'),
        # ('mycontent', 'mycontent')
    )
    objects = ChannelManager()
    owner = models.ForeignKey(User, db_column='user_id', on_delete=models.SET_NULL, help_text='채널 소유자', null=True)
    subowner = models.ForeignKey(User, db_column='subuser_id', on_delete=models.SET_NULL, help_text='채널 예비소유자',
                                 null=True, related_name='subchannel_set')
    group = models.ForeignKey(Group, on_delete=models.CASCADE, help_text='그룹')
    name = models.CharField(db_column='ch_name', max_length=255, blank=True, default='', help_text='채널명')
    type = models.CharField(db_column='ch_type', choices=TYPES, default='messenger', max_length=100, help_text='채널유형')
    is_archive = models.BooleanField(db_column="ch_is_archive", default=False, help_text='채널 비활성 여부')
    use_viewer = models.BooleanField(db_column='ch_use_viewer', default=False, help_text='뷰어기능 사용여부')
    description = models.TextField(db_column="ch_description", blank=True, null=True, help_text='설명')

    class Meta:
        db_table = "channel"

    def save_pop_owners(self, user_id):
        """
        채널 퇴장시 소유자 전환
        """
        if self.owner_id == user_id or self.subowner_id == user_id:
            self.owner_id = self.owner_id if self.owner_id != user_id else self.subowner_id
            subowner = MessengerMember.objects.filter(channel_id=self.id).exclude(user_id=self.owner_id).first()
            self.subowner = subowner.user if subowner else None
            if self.owner is None:
                self.is_archive = True
            self.save()


class ChannelContent(models.Model):
    objects = ChannelContentManager()
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE, help_text='작성자')
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, help_text='채널')
    timer = models.DateTimeField(db_column='cc_timer', null=True, blank=True, help_text='타이머 메시지 종료시점')
    is_archive = models.BooleanField(db_column="cc_is_archive", default=False, help_text='컨텐츠 비활성 여부')
    created = models.DateTimeField(db_column='cc_created', null=True, auto_now_add=True)
    updated = models.DateTimeField(db_column='cc_updated', null=True, auto_now=True)

    class Meta:
        db_table = "channel_content"


class ContentMixin:
    @property
    def user(self):
        return self.channel_content.user

    @property
    def channel(self):
        return self.channel_content.channel


class Message(ContentMixin, models.Model):
    objects = MessageManager()
    channel_content = models.ForeignKey(ChannelContent, on_delete=models.CASCADE, help_text='채널 컨텐츠')
    comment_content = models.ForeignKey(ChannelContent, related_name='children_message_set', null=True, blank=True,
                                        on_delete=models.CASCADE, help_text='답글 컨텐츠')
    content = models.TextField(db_column='ms_content', null=True, blank=True, help_text='내용')
    preview_content = models.CharField(db_column='ms_preview_content', max_length=128, null=True, blank=True,
                                       help_text='미리보기 내용')

    class Meta:
        db_table = "message"


def upload_to(instance, filename):
    return os.path.join(str(instance.channel_content_id), filename)


class Attatchment(ContentMixin, models.Model):
    TYPES = (
        ('file', '파일'),
        ('link', '링크'),
        ('editor', '에디터')
    )

    channel_content = models.ForeignKey(ChannelContent, on_delete=models.CASCADE, help_text='채널 컨텐츠')
    type = models.CharField(db_column='at_type', choices=TYPES, max_length=100, help_text='채널유형')
    file = ThumbnailerField(db_column='at_file', null=True, blank=True, upload_to=upload_to, help_text='첨부파일')
    title = models.CharField(db_column='at_title', max_length=255, help_text='제목')
    description = models.TextField(db_column='at_description', null=True, blank=True, help_text='설명')
    url = models.TextField(db_column='at_url', null=True, blank=True, help_text='링크 URL')
    image_url = models.TextField(db_column='at_image', null=True, blank=True, help_text='이미지 URL')

    @property
    def filename(self):
        if self.file:
            return self.file.name.split('/')[1]

    @property
    def filesize(self):
        if self.file:
            return self.file.size

    @property
    def thumbnail(self):
        try:
            return self.file['preview'].url
        except InvalidImageFormatError:
            pass

    class Meta:
        db_table = "attatchment"


class MessengerMember(models.Model):
    objects = MessengerMemberManager()
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE, help_text='채널 참가자')
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, help_text='채널')
    last_message = models.ForeignKey(Message, null=True, blank=True, on_delete=models.CASCADE, help_text='마지막 메시지(id)')
    notification = models.BooleanField(db_column="ms_notification", default=True, help_text='알림 여부')
    mobile_notification = models.BooleanField(db_column="ms_mobile_notification", default=True, help_text='모바일 알림 여부')

    class Meta:
        db_table = "messenger_member"
