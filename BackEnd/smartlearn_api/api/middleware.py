from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware 
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from rest_framework_simplejwt.tokens import AccessToken
from api.models import User  # Import your user model

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope["query_string"].decode())

        token = query_string.get("token", [None])[0]  # Extract token from query params
        if token:
            try:
                access_token = AccessToken(token)
                user_id = access_token["user_id"]
                scope["user"] = await self.get_user(user_id)
            except Exception as e:
                print(f"JWT Auth Failed: {e}")
                scope["user"] = AnonymousUser()

        close_old_connections()
        return await super().__call__(scope, receive, send)

    async def get_user(self, user_id):
        try:
            return await User.objects.aget(id=user_id)
        except User.DoesNotExist:
            return AnonymousUser()
