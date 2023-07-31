from django.db import models


class ChannelManager(models.Manager):
    # @property
    # def ChannelContent(self):
    #     return self.model.channelcontent_set.field.model

    def entered_channel_ids(self, user):
        return self.filter(messengermember__user_id=user.id).values_list('id', flat=True)

    def filter_direct_channel(self, owner, subowner):
        queryset = self.annotate(member_count=models.Count('messengermember'))
        if subowner is None:
            return queryset.filter(owner=owner, member_count=1).last()
        return queryset.filter(
            models.Q(owner=owner, subowner=subowner) | models.Q(owner=subowner, subowner=owner)).filter(
                member_count=2).last()

    def channel_with_notifications(self, channel_ids):
        prefetch = models.Prefetch('messengermember_set__user__notification_set')
        return self.prefetch_related(prefetch).filter(id__in=channel_ids)

    def annotate_viewset(self):
        return self.filter(type='messenger').annotate(
            member_count=models.Subquery(self.filter(id=models.OuterRef('id')).annotate(
                member_count=models.Count('messengermember')).values('member_count')[:1]),
            unread_count=models.Count('channelcontent', filter=models.Q(channelcontent__message__id__gt=models.F(
                'messengermember__last_message'), channelcontent__is_archive=False)),
            last_message_id=models.Max('channelcontent__message', filter=models.Q(channelcontent__is_archive=False)),
        ).select_related('owner', 'subowner')


class ChannelContentManager(models.Manager):
    def annotate_messenger_viewset(self):
        return self.messenger_content_filter(channel__type='messenger').order_by('-id')

    def messenger_content_filter(self, **kwargs):
        return self.annotate(name=models.F('user__last_name'), channel_name=models.F('channel__name')).filter(**kwargs)


class MessageManager(models.Manager):
    def last_message_values(self, message_ids):
        return self.filter(id__in=message_ids).values(
            'channel_content__channel_id', 'channel_content__created', 'content')


class MessengerMemberManager(models.Manager):
    def is_entered(self, channel_id, user_id):
        return self.filter(user_id=user_id, channel_id=channel_id).exists()
