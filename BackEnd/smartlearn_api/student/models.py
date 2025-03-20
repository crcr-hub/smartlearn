from django.db import models
from django.apps import apps
from courses.models import Courses,Modules
from django.contrib.auth import get_user_model



class StudentProfile(models.Model):
    user = models.OneToOneField('api.User', on_delete= models.CASCADE)
    first_name = models.CharField(max_length= 1000)
    last_name = models.CharField(max_length=1000)
    gender  = models.CharField(max_length=100,null=True,blank=True,default="Male")
    qualification = models.CharField(max_length=500,null=True,blank=True,default="Others")
    place = models.CharField(max_length=500, null=True)
    image = models.ImageField(upload_to="user_images",null = True, blank=True)
    mobile = models.CharField(max_length=15, blank=True, null=True)

class Cart(models.Model):
    user = models.ForeignKey('api.User', on_delete= models.CASCADE)
    course = models.ForeignKey(Courses,on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

class Wishlist(models.Model):
    user = models.ForeignKey('api.user',on_delete= models.CASCADE)
    course = models.ForeignKey(Courses,on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

class Order(models.Model):
    user = models.ForeignKey('api.user',on_delete= models.CASCADE)
    user_housename = models.CharField(max_length=500, null=True, blank=True)
    user_city = models.CharField(max_length=500,blank=True)
    user_pincode = models.CharField(max_length=1000,null=True,blank=True)
    date = models.DateTimeField(auto_now=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    payment_type = models.CharField(max_length=500,null=True, blank=True)
    payment_id = models.CharField(max_length=1000,blank=True,null=True)

class Order_items(models.Model):
    order = models.ForeignKey(Order,on_delete=models.CASCADE)
    course = models.ForeignKey(Courses,on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=6, decimal_places=2,null=True)
    Offer_price = models.DecimalField(max_digits=6, decimal_places=2,null=True)
    created_at =  models.DateTimeField(auto_now=True)


class EnrolledCourses(models.Model):
    user= models.ForeignKey('api.user',on_delete= models.CASCADE)
    course = models.ForeignKey(Courses,on_delete=models.CASCADE)
    starting_date = models.DateTimeField(auto_now=True)
    ended_date = models.DateTimeField(blank=True,null=True)
    is_completed = models.BooleanField(default=False)
    progress = models.BigIntegerField(default=0)
    order = models.ManyToManyField(Order_items,blank=True)

class Progress(models.Model):
    student = models.ForeignKey('api.user',on_delete=models.CASCADE,default=0)
    module = models.ForeignKey(Modules, on_delete=models.CASCADE)  # Assuming you have a Modules model
    progress = models.FloatField(default=0.0)
    time_watched = models.BigIntegerField(blank=True, null=True)  # Time the user has watched the module
    is_completed = models.BooleanField(default=False)  # Whether the module is completed
    last_updated = models.DateTimeField(auto_now=True)
    course = models.ForeignKey(Courses,on_delete=models.CASCADE,default=1)

class Comments(models.Model):
    profile = models.ForeignKey(StudentProfile,on_delete=models.CASCADE)
    module = models.ForeignKey(Modules, on_delete=models.CASCADE)
    parent = models.ForeignKey('self',null=True,blank=True, related_name='replies',on_delete=models.CASCADE)
    comment = models.CharField(max_length=5000)
    created_at = models.DateTimeField(auto_now_add=True)
    update_at= models.DateTimeField(auto_now=True)





class ChatRoom(models.Model):
    """Model for a chat room between a tutor and a student."""
    name = models.CharField(max_length=255, unique=True, blank=True,null=True)  # Room identifier (e.g., "tutor_<id>_student_<id>")
    tutor = models.ForeignKey('api.User', on_delete=models.CASCADE, related_name='tutor_chat_rooms', blank=True,null=True)
    student = models.ForeignKey('api.User', on_delete=models.CASCADE, related_name='student_chat_rooms', blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True,null=True)

    def clear_messages(self):
        """Clear all messages in this chat room."""
        self.messages.all().delete()

    def delete_room(self):
        """Delete the entire chat room."""
        self.delete()


class Message(models.Model):
    """Store messages in the chat."""
    room = models.ForeignKey(ChatRoom, on_delete=models.DO_NOTHING, related_name='messages')
    sender = models.ForeignKey('api.User', on_delete=models.DO_NOTHING,related_name='sent_messages')
    recipient = models.ForeignKey('api.User', on_delete=models.DO_NOTHING,related_name='received_messages',null=True,blank=True)
    content = models.TextField()
    image = models.ImageField(upload_to='chat_images/', null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)


class Notification(models.Model):
    sender = models.ForeignKey('api.User', on_delete=models.DO_NOTHING, related_name='sent_notifications', null=True, blank=True)
    recipient = models.ForeignKey('api.User', on_delete=models.CASCADE, related_name='received_notifications')
    message = models.TextField(null=True, blank=True)  # Optional message
    notification_type = models.CharField(max_length=50, choices=[('message', 'Message'), ('online', 'Online')])  
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)



