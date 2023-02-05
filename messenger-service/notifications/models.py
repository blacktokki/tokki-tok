from django.db import models

from accounts.models import User

# Create your models here.

class Notification(models.Model):
    TYPES = (
        ('ANDROID', 'ANDROID'),
        ('IOS', 'IOS'),
        ('WEB', 'WEB')
    )
    user = models.ForeignKey(User, db_column='user_id', on_delete=models.CASCADE, help_text='')
    type = models.CharField(db_column='nt_type', choices=TYPES, max_length=10)
    token = models.CharField(db_column='nt_token', max_length=255, null=True, blank=True, help_text='')

    class Meta:
        db_table = "notification"
        unique_together = ('user', 'type')