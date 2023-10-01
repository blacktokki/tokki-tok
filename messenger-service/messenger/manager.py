from django.db import models


class ChannelManager(models.Manager):
    # @property
    # def ChannelContent(self):
    #     return self.model.channelcontent_set.field.model

    def entered_channel_ids(self, user):
        """
        참여중인 채널 id 목록
        """
        return self.filter(messengermember__user_id=user.id).values_list('id', flat=True)

    def filter_direct_channel(self, owner, subowner):
        """
        1:1 채널 참여 여부 및 조회
        """
        queryset = self.annotate(member_count=models.Count('messengermember'))
        if subowner is None:
            return queryset.filter(owner=owner, member_count=1).last()
        return queryset.filter(
            models.Q(owner=owner, subowner=subowner) | models.Q(owner=subowner, subowner=owner)).filter(
                member_count=2).last()

    def channel_with_notifications(self, channel_ids):
        """
        채널 참가자의 알림 설정을 포함한 Prefetch
        """
        prefetch = models.Prefetch('messengermember_set__user__notification_set')
        return self.prefetch_related(prefetch).filter(id__in=channel_ids)

    def annotate_viewset(self):
        """
        채널 조회의 Queryset
        """
        return self.filter(type='messenger').annotate(
            member_count=models.Subquery(self.filter(id=models.OuterRef('id')).annotate(
                member_count=models.Count('messengermember')).values('member_count')[:1]),
            unread_count=models.Count('channelcontent', filter=models.Q(channelcontent__message__id__gt=models.F(
                'messengermember__last_message'), channelcontent__is_archive=False)),
            last_message_id=models.Max('channelcontent__message', filter=models.Q(channelcontent__is_archive=False)),
        ).select_related('owner', 'subowner')


class ChannelContentManager(models.Manager):
    def annotate_messenger_viewset(self):
        """
        채널 컨텐츠 조회의 Queryset
        """
        return self.messenger_content_filter(channel__type='messenger').order_by('-id')

    def messenger_content_filter(self, **kwargs):
        """
        작성자 이름과 채널명이 포함된 Queryset.filter
        """
        return self.annotate(name=models.F('user__last_name'), channel_name=models.F('channel__name')).filter(**kwargs)


class MessageManager(models.Manager):
    def last_message_values(self, last_message_ids):
        """
        각 last message에 대한 상세정보
        """
        return self.filter(id__in=last_message_ids).values(
            'channel_content__channel_id', 'channel_content__created', 'content', 'preview_content')


class MessengerMemberManager(models.Manager):
    def is_entered(self, channel_id, user_id):
        """
        사용자의 채널 참여 여부
        """
        return self.filter(user_id=user_id, channel_id=channel_id).exists()
