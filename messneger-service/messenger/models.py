from django.db import models

from account.models import Group, User

# Create your models here.

class Channel(models.Model):
    TYPES = (
        ('messenger', 'messenger'),
        ('board', 'board'),
    )
    owner = models.ForeignKey(User, db_column='user_id', on_delete=models.CASCADE, help_text='')
    group = models.ForeignKey(Group, on_delete=models.CASCADE, help_text='')
    name = models.CharField(db_column='ch_name', max_length=255, default='', null=True, help_text='')
    type = models.CharField(db_column='ch_type', choices=TYPES, default='messenger', max_length=100)
    description = models.TextField(db_column="ch_description",blank=True, default='', null=True, help_text='')
    is_archive = models.BooleanField(db_column="ch_is_archive", default=False, help_text='')

    class Meta:
        db_table = "channel"


class ChannelContent(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, help_text='')
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, help_text='')

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
    channel_content = models.ForeignKey(ChannelContent, on_delete=models.CASCADE, help_text='')
    comment_content = models.ForeignKey(ChannelContent, related_name='children_message_set', on_delete=models.CASCADE, help_text='')
    content = models.TextField(help_text='')

    class Meta:
        db_table = "message"


class Board(ContentMixin, models.Model):
    channel_content = models.ForeignKey(ChannelContent,  on_delete=models.CASCADE, help_text='')
    parent_content = models.ForeignKey(ChannelContent, related_name='children_board_set', on_delete=models.CASCADE, help_text='')
    title = models.CharField(max_length=255, help_text='')
    content = models.TextField(help_text='')

    class Meta:
        db_table = "board"


class MessengerMember(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, help_text='')
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, help_text='')
    last_message = models.ForeignKey(Message, on_delete=models.CASCADE, help_text='')
    notification = models.BooleanField(db_column="ms_notification", default=True, help_text='')
    mobile_notification = models.BooleanField(db_column="ms_mobile_notification", default=True, help_text='')

    class Meta:
        db_table = "messenger_member"