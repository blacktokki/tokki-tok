import json

from accounts.models import Group
from .models import Channel
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

class WebRtcConsumerMixin:
    # Receive message from client WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        # print(text_data_json)

        eventType = text_data_json['type']

        if eventType == 'ready_call':
            name = text_data_json['data']['user']
            print(self.my_name, "is request call", name)
            # print(text_data_json)


            # to notify the callee we sent an event to the group name
            # and their's groun name is the name
            async_to_sync(self.channel_layer.group_send)(
                name,
                {
                    'type': 'call_ready',
                    'data': {
                        'sender': self.my_name,
                    }
                }
            )
        
        if eventType == 'call':
            name = text_data_json['data']['name']
            print(self.my_name, "is calling", name)
            # print(text_data_json)


            # to notify the callee we sent an event to the group name
            # and their's groun name is the name
            async_to_sync(self.channel_layer.group_send)(
                name,
                {
                    'type': 'call_received',
                    'data': {
                        'caller': self.my_name,
                        'rtcMessage': text_data_json['data']['rtcMessage']
                    }
                }
            )

        if eventType == 'answer_call':
            # has received call from someone now notify the calling user
            # we can notify to the group with the caller name
            
            caller = text_data_json['data']['caller']
            print(self.my_name, "is answering", caller, "calls.")

            async_to_sync(self.channel_layer.group_send)(
                caller,
                {
                    'type': 'call_answered',
                    'data': {
                        'sender': self.my_name,
                        'rtcMessage': text_data_json['data']['rtcMessage']
                    }
                }
            )

        if eventType == 'ICEcandidate':

            user = text_data_json['data']['user']

            async_to_sync(self.channel_layer.group_send)(
                user,
                {
                    'type': 'ICEcandidate',
                    'data': {
                        'sender': self.my_name,
                        'rtcMessage': text_data_json['data']['rtcMessage']
                    }
                }
            )

    def call_ready(self, event):

        # print(event)
        print('Call ready by ', self.my_name )
        self.send(text_data=json.dumps({
            'type': 'call_ready',
            'data': event['data']
        }))

    def call_received(self, event):

        # print(event)
        print('Call received by ', self.my_name )
        self.send(text_data=json.dumps({
            'type': 'call_received',
            'data': event['data']
        }))


    def call_answered(self, event):

        # print(event)
        print(self.my_name, "'s call answered")
        self.send(text_data=json.dumps({
            'type': 'call_answered',
            'data': event['data']
        }))


    def ICEcandidate(self, event):
        self.send(text_data=json.dumps({
            'type': 'ICEcandidate',
            'data': event['data']
        }))

GROUP_PREFIX = 'group-'
CHANNEL_PREFIX = 'channel-'


class MessengerConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.user = self.scope["user"]
        self.group = Group.objects.filter(membership__user_id=self.user.id, root_id__isnull=True).first()
        self.channel_ids = set(Channel.objects.filter(messengermember__user_id=self.user.id).values_list('id', flat=True))
        
        async_to_sync(self.channel_layer.group_add)(
            f"{GROUP_PREFIX}{self.group.id}",
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
            f"{GROUP_PREFIX}{self.group.id}",
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
        channel_id = event['data']['channel_id']
        user_ids = event['data']['user_ids']
        if self.user.id not in user_ids:
            return

        self.channel_ids.add(channel_id)
        print(self.channel_ids)
        async_to_sync(self.channel_layer.group_add)(
            f"{CHANNEL_PREFIX}{channel_id}",
            self.channel_name
        )

    def leave(self, event):
        channel_id = event['data']['channel_id']
        user_ids = event['data'].get('user_ids')
        if user_ids is not None and self.user.id not in user_ids:
            return

        self.channel_ids.remove(channel_id)
        async_to_sync(self.channel_layer.group_discard)(
            f"{CHANNEL_PREFIX}{channel_id}",
            self.channel_name
        )

    def next_message(self, event):
        self.send(text_data=json.dumps(event))