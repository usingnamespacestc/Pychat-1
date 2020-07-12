from django.conf.urls import url
from . import consumers
from django.urls import re_path
websocket_urlpatterns = [
    url(r'ws/chat/(?P<user_id>\w+)/$', consumers.ChatConsumer),
]