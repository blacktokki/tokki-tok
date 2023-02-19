import json
from django.contrib.auth import get_user_model
from channels.generic.websocket import WebsocketConsumer
from messenger.consumers import connect, disconnect, USER_PREFIX
from asgiref.sync import async_to_sync

class RtcConsumer(WebsocketConsumer):    
    @connect
    def connect(self):
        pass

    @disconnect
    def disconnect(self, close_code):
        pass

    # Receive message from client WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        data = text_data_json['data']
        message_type = text_data_json['type']
        if 'username' in text_data_json:
            user = get_user_model().objects.get_by_natural_key(text_data_json['username']).id
        else:
            user = text_data_json['user']
        print(self.user.id, "send", message_type, "to", user)
        async_to_sync(self.channel_layer.group_send)(f"{USER_PREFIX}{user}", {
            'type': 'send_message',
            'message': {'sender': self.user.id, 'type':message_type, 'data': data}
        })

    def send_message(self, event):
        self.send(text_data=json.dumps(event['message']))
