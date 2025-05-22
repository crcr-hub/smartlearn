from django.urls import path
from .consumer import ChatConsumer,NotificationConsumer

websocket_urlpatterns = [
    path('ws/chat/<room_name>/', ChatConsumer.as_asgi()),
    path('ws/notifications/', NotificationConsumer.as_asgi()),
]
