import json

from messenger.serializers import ChannelSerializer

from .models import Channel
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from channels.generic.websocket import WebsocketConsumer

USER_PREFIX = 'user-'
CHANNEL_PREFIX = 'channel-'


class MessengerConsumer(WebsocketConsumer):    
    def connect(self):
        self.accept("Authorization")
        self.user = self.scope["user"]
        self.channel_ids = set(Channel.objects.filter(messengermember__user_id=self.user.id).values_list('id', flat=True))
        
        async_to_sync(self.channel_layer.group_add)(
            f"{USER_PREFIX}{self.user.id}",
            self.channel_name
        )
        for channel_id in self.channel_ids:
            async_to_sync(self.channel_layer.group_add)(
                f"{CHANNEL_PREFIX}{channel_id}",
                self.channel_name
            )

        # response to client, that we are connected.
        self.send(text_data=json.dumps({
            'type': 'connection',
            'data': {
                'message': "Connected"
            }
        }))

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            f"{USER_PREFIX}{self.user.id}",
            self.channel_name
        )
        for channel_id in self.channel_ids:
            # self.channel_ids.remove(room_id)
            async_to_sync(self.channel_layer.group_discard)(
                f"{CHANNEL_PREFIX}{channel_id}",
                self.channel_name
            )

    # Receive message from client WebSocket
    def receive(self, text_data):
        # text_data_json = json.loads(text_data)
        # print(text_data_json)

        # eventType = text_data_json['type']

        # if eventType == 'api':
        #     async_to_sync(self.channel_layer.group_send)    
        
        super().receive(text_data)
        
    def enter(self, event):
        channel_id = event['data']['id']
        print(event, self.scope["user"])
        self.channel_ids.add(channel_id)
        self.send(text_data=json.dumps(event))
        async_to_sync(self.channel_layer.group_add)(
            f"{CHANNEL_PREFIX}{channel_id}",
            self.channel_name
        )

    def leave(self, event):
        channel_id = event['data']['channel_id']

        self.channel_ids.remove(channel_id)
        async_to_sync(self.channel_layer.group_discard)(
            f"{CHANNEL_PREFIX}{channel_id}",
            self.channel_name
        )
        # self.send(text_data=json.dumps(event))

    def next_message(self, event):
        self.send(text_data=json.dumps(event))


def send_enter(channel, user_id):
    channel_data = ChannelSerializer(instance=channel).data
    async_to_sync(get_channel_layer().group_send)(f"{USER_PREFIX}{user_id}", {"type": "enter", "data": channel_data})


def send_leave(channel_id, user_id=None):
    if user_id is None:
        async_to_sync(get_channel_layer().group_send)(f"{CHANNEL_PREFIX}{channel_id}", {"type": "leave", "data": {"channel_id": channel_id}})
    async_to_sync(get_channel_layer().group_send)(f"{USER_PREFIX}{user_id}", {"type": "leave", "data": {"channel_id": channel_id}})


def send_next_message(channel_id, data):
    async_to_sync(get_channel_layer().group_send)(f"{CHANNEL_PREFIX}{channel_id}", {"type": "next_message", "data": data})
