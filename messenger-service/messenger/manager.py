from django.db import models


class ChannelManager(models.Manager):
    # @property
    # def ChannelContent(self):
    #     return self.model.channelcontent_set.field.model

    def entered_channel_ids(self, user):
        return self.filter(messengermember__user_id=user.id).values_list('id', flat=True)

    def filter_direct_channel(self, owner_channel_ids, counterpart_channel_ids, is_self):
        return self.filter(id__in=(owner_channel_ids & counterpart_channel_ids)).annotate(
            member_count=models.Subquery(self.filter(id=models.OuterRef('id')).annotate(
                member_count=models.Count('messengermember')).values('member_count')[:1]),
        ).filter(member_count=1 if is_self else 2).last()

    def channel_with_notifications(self, channel_ids):
        prefetch = models.Prefetch('messengermember_set__user__notification_set')
        return self.prefetch_related(prefetch).filter(id__in=channel_ids)

    def annotate_viewset(self):
        return self.filter(type='messenger').annotate(
            member_count=models.Subquery(self.filter(id=models.OuterRef('id')).annotate(
                member_count=models.Count('messengermember')).values('member_count')[:1]),
            unread_count=models.Count('channelcontent', filter=models.Q(channelcontent__message__id__gt=models.F(
                'messengermember__last_message'))),
            last_message_id=models.Max('channelcontent__message'),
        )


class ChannelContentManager(models.Manager):
    ANNOTATE_MESSENGER_CONTENT = {
        'name': models.F('user__last_name'),
        'channel_name': models.F('channel__name')
    }

    def annotate_board_viewset(self):
        return self.filter(channel__type='board').annotate(name=models.F('user__last_name')).order_by('-id')

    def annotate_messenger_viewset(self):
        return self.filter(channel__type='messenger').annotate(
            **self.ANNOTATE_MESSENGER_CONTENT).order_by('-id')

    def messenger_content_filter(self, **kwargs):
        return self.annotate(**self.ANNOTATE_MESSENGER_CONTENT).filter(**kwargs)


class MessageManager(models.Manager):
    def last_message_values(self, message_ids):
        return self.filter(id__in=message_ids).values(
            'channel_content__channel_id', 'channel_content__created', 'content')


class MessengerMemberManager(models.Manager):
    def channel_ids_filter(self, **kwargs):
        return self.filter(**kwargs).values_list('channel_id', flat=True)
