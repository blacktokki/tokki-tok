from asgiref.sync import sync_to_async
from django.test import TestCase
from unittest.mock import patch
from django.conf import settings
from rest_framework.test import APITestCase
from channels.testing import WebsocketCommunicator
from notifications.models import Notification

from .models import *
from .consumers import MessengerConsumer
# Create your tests here.


class TestUserMixin:
    username = settings.TEST_USERNAME
    username2 = settings.TEST_USERNAME2 or settings.USERNAME
    domain = username.split('@')[1]


class AuthenticateResponse:
    def json(self):
        return {"value": [{"username": TestUserMixin.username}]}


class MessengerTestCase(TestUserMixin, APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.get_by_natural_key(cls.username)
        cls.user2 = User.objects.get_by_natural_key(cls.username2)
        cls.group = Group.objects.get(name=cls.domain)
        cls.notification = Notification.objects.create(user=cls.user, type='WEB', token='')
        cls.notification2 = Notification.objects.create(user=cls.user2, type='WEB', token='')

    def setUp(self):
        self.client.force_login(user=self.user)

    @patch("accounts.backends.authenticate", return_value=AuthenticateResponse())
    def test_login(self, *args):
        self.client.login(username=self.username, password='#!@plug9140')

    def test_channel(self):
        # given
        channel_data = {"owner": self.user.id, "group": self.group.id, "type": "messenger", "name": ""}

        # when
        create_response = self.client.post('/api/v1/channels/', channel_data)
        list_response = self.client.get('/api/v1/channels/messenger/')
        delete_response = self.client.delete(f'/api/v1/channels/{create_response.data["id"]}/')

        # then
        self.assertEqual(create_response.status_code, 201)
        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(delete_response.status_code, 204)

    def test_direct_channel(self):
        # given
        channel_data_self = {"owner": self.user.id, "group": self.group.id, "type": "messenger", "name": ""}
        channel_data = {"owner": self.user.id, "group": self.group.id, "type": "messenger", "name": "",
                        "subowner": self.user2.id}

        # when
        create_response_self = self.client.post('/api/v1/channels/direct/', channel_data_self)
        create_response = self.client.post('/api/v1/channels/direct/', channel_data)

        # then
        self.assertEqual(create_response_self.status_code, 201)
        self.assertEqual(create_response.status_code, 201)

    def test_messenger_member(self):
        # given
        channel = Channel.objects.create(owner=self.user2, group=self.group, type='messenger', name='name')
        messengermember_data = {"user_ids": [self.user2.id, self.user.id], "channel": channel.id}

        # when
        create_response = self.client.post('/api/v1/messengermembers/bulk/', messengermember_data)
        list_response = self.client.get('/api/v1/messengermembers/user/')
        messengermember_id = list_response.data[-1]['id']
        delete_response = self.client.delete(f'/api/v1/messengermembers/{messengermember_id}/')

        # then
        self.assertEqual(create_response.status_code, 201)
        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(delete_response.status_code, 204)

    def test_messenger_content(self):
        # given
        channel = Channel.objects.create(owner=self.user, group=self.group, type='messenger', name='name')
        MessengerMember.objects.create(channel=channel, user=self.user)
        MessengerMember.objects.create(channel=channel, user=self.user2)
        content_data = {"user": self.user.id, "channel": channel.id, 'content': 'content'}
        archive_data = {'is_archive': True}

        # when
        create_response = self.client.post('/api/v1/messengercontents/', content_data)
        content_id = create_response.data['id']
        update_response = self.client.patch(f'/api/v1/messengercontents/{content_id}/', archive_data)

        # then
        self.assertEqual(create_response.status_code, 201)
        self.assertEqual(update_response.status_code, 200)


class WebsocketTestCase(TestCase):
    async def test_websocket(self):
        # given
        user = await sync_to_async(User.objects.get_by_natural_key)(TestUserMixin.username)
        channels = await sync_to_async(list)(Channel.objects.entered_channel_ids(user))

        # when
        communicator = WebsocketCommunicator(MessengerConsumer.as_asgi(), "ws/", {}, "Authorization")
        communicator.scope['user'] = user
        communicator.scope['channels'] = channels
        connected, subprotocol = await communicator.connect()
        await communicator.receive_from()
        # await communicator.send_to(text_data="")
        await communicator.disconnect()

        # then
        self.assertTrue(connected)
