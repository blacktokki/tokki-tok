import os
from django.db import models

from accounts.models import Group, User
from .manager import ChannelManager, ChannelContentManager, MessageManager, MessengerMemberManager


# Create your models here.
class Channel(models.Model):
    TYPES = (
        ('messenger', 'messenger'),
        ('board', 'board'),
    )
    objects = ChannelManager()
    owner = models.ForeignKey(User, db_column='user_id', on_delete=models.SET_NULL, help_text='', null=True)
    subowner = models.ForeignKey(User, db_column='subuser_id', on_delete=models.SET_NULL, help_text='', null=True,
                                 related_name='subchannel_set')
    group = models.ForeignKey(Group, on_delete=models.CASCADE, help_text='')
    name = models.CharField(db_column='ch_name', max_length=255, blank=True, default='', help_text='')
    type = models.CharField(db_column='ch_type', choices=TYPES, default='messenger', max_length=100)
    is_archive = models.BooleanField(db_column="ch_is_archive", default=False, help_text='')
    description = models.TextField(db_column="ch_description", blank=True, null=True, help_text='')

    class Meta:
        db_table = "channel"

    def save_pop_owners(self, user_id):
        if self.owner_id == user_id or self.subowner_id == user_id:
            self.owner_id = self.owner_id if self.owner_id != user_id else self.subowner_id
            subowner = MessengerMember.objects.filter(channel_id=self.id).exclude(user_id=self.owner_id).first()
            self.subowner = subowner.user if subowner else None
            if self.owner is None:
                self.is_archive = True
            self.save()


class ChannelContent(models.Model):
    objects = ChannelContentManager()
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE, help_text='')
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, help_text='')
    timer = models.DateTimeField(db_column='cc_timer', null=True, blank=True, help_text='')
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
    channel_content = models.ForeignKey(ChannelContent, on_delete=models.CASCADE, help_text='')
    comment_content = models.ForeignKey(ChannelContent, related_name='children_message_set', null=True, blank=True,
                                        on_delete=models.CASCADE, help_text='')
    content = models.TextField(db_column='ms_content', null=True, blank=True, help_text='')

    class Meta:
        db_table = "message"


def upload_to(instance, filename):
    return os.path.join(str(instance.channel_content_id), filename)


class File(ContentMixin, models.Model):
    channel_content = models.ForeignKey(ChannelContent, on_delete=models.CASCADE, help_text='')
    file = models.FileField(db_column='fi_file', null=True, blank=True, upload_to=upload_to, help_text='')

    @property
    def filename(self):
        if self.file:
            return self.file.name.split('/')[1]

    @property
    def filesize(self):
        if self.file:
            return self.file.size

    class Meta:
        db_table = "file"


class Link(ContentMixin, models.Model):
    channel_content = models.ForeignKey(ChannelContent, on_delete=models.CASCADE, help_text='')
    title = models.CharField(db_column='li_title', max_length=255, help_text='')
    description = models.TextField(db_column='li_description', null=True, blank=True, help_text='')
    url = models.TextField(db_column='li_url', null=True, blank=True, help_text='')
    image = models.TextField(db_column='li_image', null=True, blank=True, help_text='')

    class Meta:
        db_table = "link"


class MessengerMember(models.Model):
    objects = MessengerMemberManager()
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE, help_text='')
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, help_text='')
    last_message = models.ForeignKey(Message, null=True, blank=True, on_delete=models.CASCADE, help_text='')
    notification = models.BooleanField(db_column="ms_notification", default=True, help_text='')
    mobile_notification = models.BooleanField(db_column="ms_mobile_notification", default=True, help_text='')

    class Meta:
        db_table = "messenger_member"
