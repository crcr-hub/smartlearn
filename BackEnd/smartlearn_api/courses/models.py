from django.db import models
from teacher.models import TeacherProfile
from .task import process_m3u8_duration
# Create your models here.

class Category(models.Model):
    PUBLIC = 'public'
    PRIVATE = 'private'
    VISIBLE_CHOICES = [(PUBLIC, 'Public'),(PRIVATE, 'Private'),]
    title = models.CharField(max_length=500)
    description = models.CharField(max_length=1000)
    visible_status = models.CharField(max_length=10,choices=VISIBLE_CHOICES,default='public')


def upload_to(instance, filename):
    return 'courses/{filename}'.format(filename=filename)

class Courses(models.Model):
    PUBLIC = 'Public'
    PRIVATE = 'Private'
    WAITING = 'Waiting'
    PUTONHOLD = 'Hold'
    REJECTED = 'Rejected'
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    teacher = models.ForeignKey(TeacherProfile, on_delete=models.CASCADE,related_name="courses")
    name = models.CharField(max_length=500,null=True,blank=True)
    description = models.CharField(max_length=50000,null=True,blank=True)
    requirements = models.CharField(max_length=1000,null=True,blank=True)
    images = models.ImageField(upload_to=upload_to,null=True, blank=True)
    date_created = models.DateField(auto_now=True)
    price =models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    offer_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    cover_text = models.CharField(max_length=1000, null=True,blank=True)
    VISIBLE_CHOICES = [(PUBLIC, 'Public'),(PRIVATE, 'Private'),(WAITING,'Waiting'),(PUTONHOLD,'Hold'),(REJECTED,'Rejected')]
    visible_status = models.CharField(max_length=100,choices=VISIBLE_CHOICES,default='Private')


class CourseStatus(models.TextChoices):
    PUBLIC = 'Public', 'Public'
    PRIVATE = 'Private', 'Private'
    WAITING = 'Waiting', 'Waiting'
    PUTONHOLD = 'Hold', 'Hold'
    REJECTED = 'Rejected', 'Rejected'


class Status(models.Model):
    PUBLIC = 'Public'
    PUTONHOLD = 'Hold'
    REJECTED = 'Rejected'
    PRIVATE = 'private'
    WAITING = 'Waiting'
    course = models.ForeignKey(Courses,on_delete=models.CASCADE)
    course_status = models.CharField(
        max_length=20,
        choices=CourseStatus.choices,
        default=CourseStatus.PRIVATE
    )
    reason = models.CharField(max_length=50000,null=True,blank=True)
    required = models.CharField(max_length=50000,null=True,blank=True)
    date = models.DateField(auto_now_add=True)


import subprocess
import requests
import tempfile
import os
import m3u8
from urllib.parse import urljoin
from django.db.models.signals import pre_save
from django.dispatch import receiver
class Modules(models.Model):
    course = models.ForeignKey(Courses, on_delete=models.CASCADE)
    number = models.IntegerField(blank=True, null=True)
    topic = models.CharField(max_length=2000, null=True,blank=True)
    sub_topic = models.CharField(max_length=2000, null=True,blank=True)
    media = models.URLField(blank=True, null=True)
    total_time = models.BigIntegerField(blank=True,null=True)
    video_path = models.CharField(max_length=500, blank=True, null=True)  # Temp file path
    processing_status = models.CharField(max_length=50, default="Pending")
    updated_at = models.DateTimeField(auto_now=True)
    def update_status(self, status):
        self.processing_status = status
        self.save(update_fields=["processing_status"])


@receiver(pre_save, sender=Modules)
def trigger_m3u8_processing(sender, instance, **kwargs):
    if instance.pk:  # Check if it's an update (not a new object)
        try:
            existing_instance = Modules.objects.get(pk=instance.pk)
            
            if existing_instance.media != instance.media or existing_instance.updated_at != instance.updated_at:
                process_m3u8_duration.delay(instance.id, instance.media)
        except Modules.DoesNotExist:
            pass  # This happens when creating a new instance
    elif instance.media and instance.media.endswith(".m3u8"):  # New instance with media
        process_m3u8_duration.delay(instance.id, instance.media)
    

class RatingStar(models.Model):
    course = models.ForeignKey(Courses,on_delete=models.CASCADE)
    user = models.ForeignKey('api.user',on_delete=models.CASCADE)
    star = models.IntegerField(default=0)
    feedback = models.CharField(max_length=5000,blank=True,null=True)
    created_at = models.DateTimeField(auto_now=True)