from django.db import models

from messenger.models import ChannelContent, ContentMixin

# Create your models here.
class Board(ContentMixin, models.Model):
    channel_content = models.ForeignKey(ChannelContent,  on_delete=models.CASCADE, help_text='')
    parent_content = models.ForeignKey(ChannelContent, related_name='children_board_set', null=True, blank=True, on_delete=models.CASCADE, help_text='')
    title = models.CharField(db_column='bo_title', max_length=255, help_text='')
    content = models.TextField(db_column='bo_content', null=True, blank=True, help_text='')

    class Meta:
        db_table = "board"