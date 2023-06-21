import socket
import py_eureka_client.eureka_client as eureka_client
from django.core.management.base import BaseCommand
from django.conf import settings


class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def add_arguments(self, parser):
        parser.add_argument('--port', type=int, default=8000)

    def handle(self, *args, **options):
        host = settings.HOST
        port = options['port']
        # The flowing code will register your server to eureka server and also start to send heartbeat every 30 seconds
        print(f'Eureka client init: {host}:{port}')
        try:
            eureka_client.stop()
            eureka_client.init(
                eureka_server="http://10.178.0.4:8761",
                app_name="messenger",
                instance_host='10.178.0.9',
                instance_port=port,
                on_error=self.on_err)
            eureka_client.get_event_loop().run_forever()
            eureka_client.stop()
        except Exception:
            pass

    @classmethod
    def on_err(err_type: str, err: Exception):
        print(f"{err_type}::{err}")
        if err_type in (eureka_client.ERROR_REGISTER, eureka_client.ERROR_DISCOVER):
            print('Eureka client stop')
            eureka_client.stop()
