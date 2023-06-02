import json
from django.contrib.auth import get_user_model
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync, sync_to_async
from pyforkurento import client
from messenger.consumers import connect, disconnect


class BroadcastMixin:
    def receive_broadcast(self, channel_id):
        self.channel_id = channel_id
        async_to_sync(self.channel_layer.group_send)(f"{self.CHANNEL_PREFIX}{channel_id}", {
            "type": "broadcast", "message": {
                "type": "broadcast_guest",
                "sender": self.channel_name,
                "data": {}
            }
        })
        async_to_sync(self.channel_layer.group_add)(
            f"{self.CHANNEL_PREFIX}{channel_id}",
            self.channel_name
        )

    def disconnect_broadcast(self):
        if hasattr(self, 'channel_id'):
            async_to_sync(self.channel_layer.group_discard)(
                f"{self.CHANNEL_PREFIX}{self.channel_id}",
                self.channel_name
            )
            async_to_sync(self.channel_layer.group_send)(f"{self.CHANNEL_PREFIX}{self.channel_id}", {
                "type": "broadcast", "message": {
                    "type": "broadcast_disconnect",
                    "sender": self.channel_name,
                    "data": {}
                }
            })

    def broadcast(self, event):
        if event['message']['type'] == 'broadcast_guest':
            async_to_sync(self.channel_layer.send)(event['message']['sender'], {"type": "broadcast", "message": {
                "type": "broadcast_host",
                "sender": self.channel_name,
                "data": {}
            }})
        self.send(text_data=json.dumps(event['message']))


class P2PConsumer(BroadcastMixin, WebsocketConsumer):
    USER_PREFIX = 'rtc-user'
    CHANNEL_PREFIX = 'rtc-channel-'

    @connect
    def connect(self):
        pass

    @disconnect
    def disconnect(self, close_code):
        self.disconnect_broadcast()
        pass

    # Receive message from client WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        data = text_data_json['data']
        message_type = text_data_json['type']
        if message_type == 'broadcast':
            self.receive_broadcast(data["channel_id"])
            return
        receiver = text_data_json['receiver']
        print(f"{self.channel_name}(id: {self.user.id})", "send", message_type, "to", receiver)
        async_to_sync(self.channel_layer.send)(receiver, {
            'type': 'send_message',
            'message': {'sender': self.channel_name, 'type': message_type, 'data': data}
        })

    def send_message(self, event):
        self.send(text_data=json.dumps(event['message']))


class KurentoMemoryMixin:
    @property
    def _endpoints(self):
        if not hasattr(self, '_endpoint_dict'):
            self._endpoint_dict = {}
        return self._endpoint_dict

    @property
    def pipeline(self):
        if not hasattr(self, '_pipeline'):
            self._pipeline = self.cli.create_media_pipeline()
        return self._pipeline

    def get_endpoint(self, user_id):
        return self._endpoints.get(user_id)

    def set_endpoint(self, user_id, endpoint):
        self._endpoints[user_id] = endpoint


class KurentoConsumer(KurentoMemoryMixin, WebsocketConsumer):
    USER_PREFIX = 'rtc-user'
    CHANNEL_PREFIX = 'rtc-channel-'
    BAND_WIDTH = 8000

    @connect
    def connect(self):
        self.cli = client.KurentoClient("ws://localhost:8888/kurento")
        self.cli.ping()  # Test connection with KMS

    @disconnect
    def disconnect(self, close_code):
        """ Runs when the JS client disconnects"""
        sync_to_async(self.cli.__del__)

    def _guest_sendICE(self, user):
        def _func(resp):
            ice = resp["payload"]["candidate"]
            async_to_sync(self.channel_layer.group_send)(f"{self.USER_PREFIX}{user}", {
                'type': 'send_message',
                'message': {
                    'sender': self.user.id,
                    'type': "ICEcandidate",
                    'data': {"rtcMessage": ice, "target": "guest"}
                }
            })
        return _func

    def _sendICE(self, host):
        def _func(resp):
            """ This callback function gets an ICE candidate from KMS, then sends it back to the client
            """
            ice = resp["payload"]["candidate"]
            if resp['subscriber'] in host.guests_func:
                host.guests_func[resp['subscriber']](resp)
            else:
                self.send(text_data=json.dumps({
                    "sender": self.user.id,
                    "type": "ICEcandidate",
                    "data": {"rtcMessage": ice, "target": "host"}
                }))
        return _func

    def _post_host_finished_callback(self, host_id, guest_id):
        def _func(resp):
            host = self.get_endpoint(host_id)
            if host.elem_id == resp['subscriber']:
                self._post_host_finished(host_id, guest_id)
        return _func

    def _post_host_finished(self, host_id, guest_id):
        print('guest start', guest_id)
        host = self.get_endpoint(host_id)
        guest = self.pipeline.add_endpoint("WebRtcEndpoint")
        self.setVideoSendBandwidth(guest, self.BAND_WIDTH)
        self.set_endpoint(guest_id, guest)
        host.guests_func[guest.elem_id] = self._guest_sendICE(guest_id)
        async_to_sync(self.channel_layer.group_send)(f"{self.USER_PREFIX}{guest_id}", {
            'type': 'send_message',
            'message': {'sender': self.user.id, 'type': 'start', 'data': {'username': self.user.username}}
        })

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        data = text_data_json['data']
        message_type = text_data_json['type']
        if 'username' in text_data_json:
            user = get_user_model().objects.get_by_natural_key(text_data_json['username']).id
        else:
            user = text_data_json['user']
        print('@@@', self.user.id, "send", message_type, "to", user)
        message = {'sender': self.user.id, 'type': message_type, 'data': data}
        if message_type in ["start", "end"] or data.get("target") == 'host':
            async_to_sync(self.channel_layer.group_send)(f"{self.USER_PREFIX}{user}", {
                'type': 'receive_host',
                'host': user,
                'guest': self.user.id,
                'message': message
            })
        elif message_type in ['call', 'ICEcandidate']:
            self.receive_host({
                'host': self.user.id,
                'guest': user,
                'message': message
            })
        else:
            async_to_sync(self.channel_layer.group_send)(f"{self.USER_PREFIX}{user}", {
                'type': 'send_message',
                'message': {'sender': self.user.id, 'type': message_type, 'data': data}
            })

    def receive_host(self, event):
        message = event['message']
        message_type = message['type']
        data = message.get('data')
        if (message_type == "start"):
            if self.get_endpoint(event['host']) is None:
                host = self.pipeline.add_endpoint("WebRtcEndpoint")
                self.set_endpoint(event['host'], host)
                self.setVideoSendBandwidth(host, self.BAND_WIDTH)
                self.send(text_data=json.dumps(message))
            else:
                self._post_host_finished(event['host'], event['guest'])
        elif (message_type == 'call'):
            if data['target'] == 'guest':
                host = self.get_endpoint(event['host'])
                offer = data["rtcMessage"]
                answer_sdp = host.process_offer(offer['sdp'])
                self.send(text_data=json.dumps({
                    "sender": event['guest'],
                    "type": "answer",
                    "data": {"target": "host", "rtcMessage": {"type": "answer", "sdp": answer_sdp}}
                }))
                host.guests_func = {}
                host.add_event_listener("OnIceCandidate", self._sendICE(host))
                host.add_event_listener("OnIceGatheringDone", self._post_host_finished_callback(
                    event['host'], event['guest']))
                host.gather_ice_candidates()
            elif data['target'] == 'host':
                host = self.get_endpoint(event['host'])
                guest = self.get_endpoint(event['guest'])
                offer = data["rtcMessage"]
                answer_sdp = guest.process_offer(offer['sdp'])
                host.connect(guest)
                async_to_sync(self.channel_layer.group_send)(f"{self.USER_PREFIX}{event['guest']}", {
                    'type': 'send_message',
                    'message': {'sender': self.user.id, 'type': 'answer', "data": {"target": "guest", "rtcMessage": {
                        "type": "answer", "sdp": answer_sdp}}}
                })
                guest.add_event_listener("OnIceCandidate", self._guest_sendICE(event['guest']))
                guest.add_event_listener("OnIceGatheringDone", lambda e: print('guest finish'))
        elif (message_type == 'ICEcandidate'):
            ice = data["rtcMessage"]
            if data['target'] == 'guest':
                endpoint = self.get_endpoint(event['host'])
            else:
                endpoint = self.get_endpoint(event['guest'])
            endpoint.add_ice_candidate(ice)
        elif (message_type == "end"):
            guest = self.get_endpoint(event['guest'])
            guest.gather_ice_candidates()

    def send_message(self, event):
        self.send(text_data=json.dumps(event['message']))

    @staticmethod
    def setVideoSendBandwidth(endpoint, value):
        endpoint.pipeline._invoke({
            "object": endpoint.elem_id,
            "operation": "setMinVideoRecvBandwidth",
            "operationParams": {
                "minVideoRecvBandwidth": int(value * 0.75)
            },
            "sessionId": endpoint.session_id
        })
        endpoint.pipeline._invoke({
            "object": endpoint.elem_id,
            "operation": "setMaxVideoSendBandwidth",
            "operationParams": {
                "maxVideoSendBandwidth": value
            },
            "sessionId": endpoint.session_id
        })
        endpoint.pipeline._invoke({
            "object": endpoint.elem_id,
            "operation": "setMinVideoSendBandwidth",
            "operationParams": {
                "minVideoSendBandwidth": value
            },
            "sessionId": endpoint.session_id
        })
