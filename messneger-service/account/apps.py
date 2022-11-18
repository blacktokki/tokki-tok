import sys
import py_eureka_client.eureka_client as eureka_client
from django.apps import AppConfig


def on_err(err_type: str, err: Exception):
    print(f"@@{err_type}::{err}")
    if err_type in (eureka_client.ERROR_REGISTER, eureka_client.ERROR_DISCOVER):
        print('Eureka client stop')
        eureka_client.stop()


class AccountConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'account'

    def ready(self):
        if sys.argv[1] == 'runserver':
            port = sys.argv[2] if len(sys.argv)>2 else 8000
            # The flowing code will register your server to eureka server and also start to send heartbeat every 30 seconds
            print('Eureka client init')
            try:
                eureka_client.stop()
                eureka_client.init(eureka_server="http://localhost:8761", app_name="messenger", instance_host='localhost', instance_port=port, on_error=on_err)
            except Exception:
                pass
