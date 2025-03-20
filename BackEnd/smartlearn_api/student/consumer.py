import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

from .models import ChatRoom,Message,StudentProfile,Notification
from teacher.models import TeacherProfile
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from datetime import datetime
from django.db.models import F
from api.models import UserStatus

User = get_user_model()
ONLINE_USERS = {}
ACTIVE_USERS = {}
logged_in_users = {}
@sync_to_async
def get_user_by_id(user_id):
    """Fetch the User object by user ID."""
    return User.objects.get(id=user_id)

@sync_to_async
def get_or_create_chat_room(student, tutor):
    """Get or create a chat room between a student and a tutor."""
    room_name = f"chat_tutor_{tutor.id}_student_{student.id}"  # Unique room for the tutor-student pair
    chat_room, created = ChatRoom.objects.get_or_create(
        name=room_name,
        tutor=tutor,
        student=student
    )
    return chat_room


@sync_to_async
def save_message(chat_room, sender,recipient,content,image_url):
    """Save a message to the database."""
    
    message = Message.objects.create(room=chat_room, sender=sender,recipient=recipient, content=content,image=image_url)
    return message



@sync_to_async
def get_user_from_student_profile(student_profile_id):
    """Fetch the associated User object from StudentProfile."""
    student_profile = StudentProfile.objects.get(id=student_profile_id)
    return student_profile.user  # Assuming StudentProfile has a 'user' field


@sync_to_async
def get_user_from_tutor_profile(tutor_profile_id):
    """Fetch the associated User object from TutorProfile."""
    tutor_profile = TeacherProfile.objects.get(id=tutor_profile_id)
    return tutor_profile.user  # Assuming TutorProfile has a 'user' field


@sync_to_async
def get_user_from_profile(profile_id):
    """Retrieve the User object from a profile ID (either tutor or student)."""
    try:
        # First, check if it's a TutorProfile
        tutor_profile = TeacherProfile.objects.filter(id=profile_id).first()
        if tutor_profile:
            return tutor_profile.user  # Return the associated user

        # If not a tutor, check StudentProfile
        student_profile = StudentProfile.objects.filter(id=profile_id).first()
        if student_profile:
            return student_profile.user  # Return the associated user

    except Exception as e:
        print(f"Error retrieving user from profile: {e}")

    return None  # Return None if not found

@sync_to_async
def update_message_read_status(message):
    """Mark message as read if recipient is online."""
    print("is read status")
    message.is_read = True
    message.save()

@sync_to_async
def create_notification(sender,reciever,message_content):
     notification = Notification.objects.create(
                sender =sender,
                recipient = reciever,
                message = message_content,
                notification_type = "message")
     return notification

@sync_to_async
def get_logged_in_users():
    """Fetch all logged-in users from UserStatus."""
    return set(UserStatus.objects.filter(is_online=True).values_list('user_id', flat=True))

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"{self.room_name}"
        ONLINE_USERS[self.user.id] = self.room_group_name
        print("online users.........",ONLINE_USERS)
        logged_in_users = await get_logged_in_users()
        print("Logged-in users (from UserStatus):", logged_in_users)

        # Split the room name to extract tutorId and studentId
        room_parts = self.room_name.split('_')
        if len(room_parts) != 5 or room_parts[1] != 'tutor' or room_parts[3] != 'student':
            # Validate room name format
            await self.close()  # Close the connection if the format is invalid
            return

        try:
            tutor_id = int(room_parts[2])  # Extract tutor ID
            student_id = int(room_parts[4])  # Extract student ID
        except ValueError:
            # If IDs are not valid integers, close the connection
            await self.close()
            return
        if self.user.id not in ACTIVE_USERS:
            ACTIVE_USERS[self.user.id] = True
        print("active users........",ACTIVE_USERS,"online users......",ONLINE_USERS,"logged in user",logged_in_users)
        # Fetch the User objects based on the IDs
        tutor_user = await get_user_from_tutor_profile(tutor_id)
        student_user = await get_user_from_student_profile(student_id)

        # Get or create the chat room
        self.chat_room = await get_or_create_chat_room(student=student_user, tutor=tutor_user)

        # Add this channel to the group (the group should be per-user rather than per-room)
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # Additionally, add the users (tutor and student) to their own unique groups based on their user IDs
        await self.channel_layer.group_add(
            f"user_{tutor_user.id}",  # Unique group for the tutor
            self.channel_name
        )
        await self.channel_layer.group_add(
            f"user_{student_user.id}",  # Unique group for the student
            self.channel_name
        )

        await self.accept()
        old_messages = await self.get_old_messages(self.chat_room)
        old_messages = self.serialize_messages(old_messages)
        await self.send(text_data=json.dumps({        
            "type": "old_messages",
            "messages": old_messages}))

    # async def sendMessage(self, event):
    #     await self.send(text_data=json.dumps(event))
    def serialize_messages(self,messages):
        for msg in messages:
                if isinstance(msg.get("timestamp"), datetime):  # Change "timestamp" to your actual datetime field
                    msg["timestamp"] = msg["timestamp"].isoformat()  # Convert to string
        return messages



    @database_sync_to_async
    def fetch_old_messages(self, chat_room):
        """Synchronous function to fetch messages properly."""
        return list(
            Message.objects.filter(room=chat_room)
            .order_by("timestamp")
            .annotate(
            sender_profile_id=F("sender__studentprofile__id"),  
            sender_tutor_profile_id=F("sender__teacherprofile__id"),  
            recipient_profile_id=F("recipient__studentprofile__id"),  
            recipient_tutor_profile_id=F("recipient__teacherprofile__id")
        )
        .values(
            "sender_profile_id", 
            "sender_tutor_profile_id", 
            "recipient_profile_id", 
            "recipient_tutor_profile_id",
            "image",
            "content", 
            "timestamp",
            "is_read",
        )
        )
    
    async def get_old_messages(self, chat_room):
        """Fetch old messages from the database."""
        print("fetching the messages",chat_room)
        messages = await self.fetch_old_messages(chat_room)
        
        formatted_messages = []
        for msg in messages:
            sender_profile_id = msg["sender_profile_id"] or msg["sender_tutor_profile_id"]  # Choose the correct profile ID
            recipient_profile_id = msg["recipient_profile_id"] or msg["recipient_tutor_profile_id"]

            formatted_messages.append({
                "sender": sender_profile_id,
                "recipient_profile_id": recipient_profile_id,
                "content": msg["content"],
                "image":msg["image"],
                "timestamp": msg["timestamp"],
                "is_read" : msg["is_read"]
            })
        return formatted_messages


    async def receive(self, text_data):
        logged_in_users = await get_logged_in_users()
        print("Logged-in users (from UserStatus):", logged_in_users)
        data = json.loads(text_data)
        print("Received data:", data)  # Log the incoming data
        user_id = data.get('sender_id')
        user2_id = data.get('recipient_id')
        image_url = data.get('image', None)

        try:
            message_content = data['message']
        except KeyError:
            print("Error: 'message' key is missing in data:", data)
            return  # Early return or handle error as needed
        sender_id = await get_user_from_profile(user_id)
        #sender_id = self.scope['user'].id  # The ID of the user sending the message
        recipient_id =  await get_user_from_profile(user2_id) # The ID of the recipient (tutor or student)
       
        if recipient_id is None:
            print("Error: 'recipient_id' is missing in data:", data)
            return  # Handle error for missing recipient_id

        # Use the already fetched or created chat room
        chat_room = self.chat_room
       
        # Get the sender user object
        sender = await get_user_by_id(sender_id.id)
        reciever = await get_user_by_id(recipient_id.id)
        message = await save_message(chat_room, sender,reciever, message_content,image_url)
        if ONLINE_USERS.get(reciever.id) == self.room_group_name:
            await update_message_read_status(message)   # Mark as read
        elif reciever.id not in ONLINE_USERS and reciever.id not in logged_in_users :  
            await create_notification(sender,reciever,message_content)
            print(f"User {reciever.id} is not online at all.")
        elif  reciever.id  in logged_in_users :  
            print("loggedin",logged_in_users)
            if reciever.id in ONLINE_USERS:
                await create_notification(sender, reciever, message_content)
                print(f"User {reciever.id} is online in another chat room:")

                #  Notify the user in their current room
                await self.channel_layer.group_send(
                    f"user_{reciever.id}",
                    {
                        "type": "new_notification",
                        "message": message_content,
                        "from_user": sender.id,
                        "reciever" : reciever.id,
                        "image" : image_url,
                        "timestamp": datetime.now().isoformat()
                    }
                )
                print(f"User {reciever.id} is online but in a different chat room: {ONLINE_USERS[reciever.id]}")
            else:
                await create_notification(sender, reciever, message_content)
                print(f"User {reciever.id} is logged in")

        print(f"User joined room: {self.room_group_name}")
        await self.channel_layer.group_send(
           self.room_group_name,
                {
                     "type": 'sendMessage',
                    'message': message_content,
                    'sender': user_id,
                    "image":image_url,
                    'timestamp': datetime.now().isoformat(),
                    'is_read':  message.is_read
                }
            )
        print(f"Message sent: {message_content}, sender: {sender.id}, recipient: {recipient_id},is_read :{message.is_read}")



    async def new_notification(self, event):
        """Send a notification to the user in their current chat room."""
        print("Sending notification:", event)
        await self.send(text_data=json.dumps({
            "type": "notification",
            "message": event["message"],
            "from_user": event["from_user"],
            "reciepient" : event['reciever'],
            "image" : event['image'],
            "timestamp": event["timestamp"]
        }))


    async def disconnect(self, close_code):  
        ONLINE_USERS.pop(self.user.id, None)
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def sendMessage(self, event):
        """Send the message to WebSocket."""
        print("Broadcasting message:", event) 
        message = event['message']
        sender = event['sender']
        timestamp = event['timestamp']
        image = event['image']
        is_read = event['is_read']
        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender,
            'timestamp':timestamp,
            'image': image,
            'is_read':is_read,
        }))





# class ChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.room_name = self.scope['url_route']['kwargs']['room_name']
#         self.room_group_name = f"{self.room_name}"

#         # Split the room name to extract tutorId and studentId
#         room_parts = self.room_name.split('_')
#         if len(room_parts) != 5 or room_parts[1] != 'tutor' or room_parts[3] != 'student':
#             await self.close()  # Close the connection if the format is invalid
#             return

#         try:
#             self.tutor_id = int(room_parts[2])  # Extract tutor ID
#             self.student_id = int(room_parts[4])  # Extract student ID
#         except ValueError:
#             await self.close()
#             return

#         # Fetch the User objects based on the IDs
#         self.tutor_user = await get_user_from_tutor_profile(self.tutor_id)
#         self.student_user = await get_user_from_student_profile(self.student_id)

#         # Get or create chat room
#         self.chat_room = await get_or_create_chat_room(student=self.student_user, tutor=self.tutor_user)

#         # Add this channel to the chat room group (only this specific chat room)
#         await self.channel_layer.group_add(
#             self.room_group_name,
#             self.channel_name
#         )

#         await self.accept()

#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         print("Received data:", data)  # Log incoming data

#         sender_profile_id = data.get('sender_id')
#         recipient_id = data.get('recipient_id')
#         message_content = data.get('message')

#         if not sender_profile_id or not recipient_id or not message_content:
#             print("Invalid message data:", data)
#             return

#         sender_user = await get_user_from_profile(sender_profile_id)
#         # Determine sender user object (tutor or student)
#         sender = await get_user_by_id(sender_user.id)

#         # Save message to database
#         await save_message(self.chat_room, sender, message_content)
#         print(f"User joined room: {self.room_group_name}")
#         # Send the message only to users in this chat room
#         await self.channel_layer.group_send(
#             self.room_group_name,
#             {
#                 "type": "sendMessage",
#                 "message": message_content,
#                 "sender": sender.id
#             }
#         )

#     async def sendMessage(self, event):
#         """Send the message only to users in the same chat room."""
#         print("Broadcasting message:", event) 
#         await self.send(text_data=json.dumps({
#             'message': event['message'],
#             'sender': event['sender']
#         }))
