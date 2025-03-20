import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from api.middleware import JWTAuthMiddleware
# from student.routing import websocket_urlpatterns  # Replace 'your_app' with your actual app name
django.setup()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smartlearn_api.settings')

from student.routing import websocket_urlpatterns

# Initialize Django's ASGI application for HTTP
django_asgi_app = get_asgi_application()

# Define the application with Channels
application = ProtocolTypeRouter({
    "http": django_asgi_app,  # Handles HTTP requests
    "websocket": AuthMiddlewareStack(  # Handles WebSocket connections
        JWTAuthMiddleware(URLRouter(
            websocket_urlpatterns
        ))
    ),
})

