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
    PUBLIC = 'public'
    PRIVATE = 'private'
    WAITING = 'waiting'
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
    VISIBLE_CHOICES = [(PUBLIC, 'Public'),(PRIVATE, 'Private'),(WAITING,'waiting')]
    visible_status = models.CharField(max_length=10,choices=VISIBLE_CHOICES,default='waiting')


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
    
    # def save(self, *args, **kwargs):
    #     if self.media and self.media.endswith(".m3u8"):  
    #         try:
    #             # 🔹 Step 1: Fetch M3U8 content
    #             response = requests.get(self.media, timeout=10)
    #             if response.status_code != 200:
    #                 print(" M3U8 file is not accessible")
    #                 self.total_time = None
    #             else:
    #                 m3u8_obj = m3u8.loads(response.text)

    #                 # 🔹 Step 2: Check if it's a master playlist
    #                 if m3u8_obj.playlists:
    #                     print("🔍 Detected master playlist, selecting first variant")
    #                     first_variant_url = urljoin(self.media, m3u8_obj.playlists[0].uri)

    #                     # Fetch the actual media playlist
    #                     response = requests.get(first_variant_url, timeout=10)
    #                     m3u8_obj = m3u8.loads(response.text)

    #                 # 🔹 Step 3: Extract segment durations
    #                 total_duration = sum(segment.duration for segment in m3u8_obj.segments)
    #                 if total_duration > 60:
    #                     total_duration -= 60
    #                 print(f"Extracted Duration: {total_duration} seconds")
    #                 self.total_time = int(total_duration)
                    

    #         except Exception as e:
    #             print(f" Error calculating duration for M3U8: {e}")
    #             self.total_time = None

    #     super().save(*args, **kwargs)

class RatingStar(models.Model):
    course = models.ForeignKey(Courses,on_delete=models.CASCADE)
    user = models.ForeignKey('api.user',on_delete=models.CASCADE)
    star = models.IntegerField(default=0)
    feedback = models.CharField(max_length=5000,blank=True,null=True)
    created_at = models.DateTimeField(auto_now=True)