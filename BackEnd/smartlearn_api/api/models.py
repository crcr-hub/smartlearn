from django.db import models
from django.contrib.auth.models import AbstractUser
from courses.models import Courses
from student.models import StudentProfile
from teacher.models import TeacherProfile 


class User(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
    ]
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=100, choices=ROLE_CHOICES, default='student')
    block_status = models.BooleanField(default=False)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    # Fix groups field clash with related_name
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='api_user_groups',  # Custom related_name to avoid conflict
        blank=True
    )

    # Fix user_permissions field clash with related_name
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='api_user_permissions',  # Custom related_name to avoid conflict
        blank=True
    )

    def __str__(self):
        return self.username
    def studentprofile(self):
        profile = StudentProfile.objects.get(user=self)
    def teacherprofile(self):
        profile = TeacherProfile.objects.get(user=self)



class UserStatus(models.Model):
    """Track if a user is online or offline."""
    user = models.OneToOneField('api.User', on_delete=models.CASCADE, related_name='status')
    is_online = models.BooleanField(default=False)
    last_seen = models.DateTimeField(auto_now=True)

class AdminNotification(models.Model):
    sender = models.ForeignKey('api.User', on_delete=models.CASCADE, related_name='sender_notifications')
    course = models.ForeignKey(Courses,on_delete=models.CASCADE)
    message = models.TextField(default="New course submitted for approval.",blank=True) 
    timestamp = models.DateTimeField(auto_now_add =True)
    is_seen = models.BooleanField(default=False)
