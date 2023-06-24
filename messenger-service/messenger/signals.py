from django.db.models.signals import pre_delete, post_delete
from django.dispatch import receiver
from .models import Channel, ChannelContent
from .consumers import send_leave, send_delete_message


@receiver(pre_delete, sender=ChannelContent)
@receiver(pre_delete, sender=Channel)
def pre_delete_cache_id(sender, instance, **kwargs):
    instance._id = instance.id


@receiver(post_delete, sender=Channel)
def post_delete_channel(sender, instance, **kwargs):
    if instance.type == "messenger":
        send_leave(instance._id)


@receiver(post_delete, sender=ChannelContent)
def post_delete_message(sender, instance, **kwrags):
    send_delete_message(instance.channel_id, instance._id)
