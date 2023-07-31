from django.db import models

from accounts.models import User


# Create your models here.
class Notification(models.Model):
    TYPES = (
        ('ANDROID', 'ANDROID'),
        ('IOS', 'IOS'),
        ('WEB', 'WEB')
    )
    user = models.ForeignKey(User, db_column='user_id', on_delete=models.CASCADE, help_text='사용자 id')
    type = models.CharField(db_column='nt_type', choices=TYPES, max_length=10, help_text='알림 유형(ANDROID|IOS|WEB)')
    token = models.CharField(db_column='nt_token', max_length=255, null=True, blank=True, help_text='FCM token')

    class Meta:
        db_table = "notification"
        unique_together = ('user', 'type')
