from django.urls import re_path
from chat.consumers import ChatAppConsumer

websocket_urlpatterns = [

    re_path(r'ws/chat/(?P<room_name>\w+)/$', ChatAppConsumer.as_asgi()),
    
]
