from django.db import models

from django.apps import apps


class TeacherProfile(models.Model):
    user = models.OneToOneField('api.User', on_delete=models.CASCADE,related_name='teacherprofile')
    first_name = models.CharField(max_length=500)
    last_name = models.CharField(max_length=500)
    gender = models.CharField(max_length=100, default='Male')
    qualification = models.CharField(max_length=500)
    experience = models.CharField(max_length=200,null=True,blank=True)
    experience_in = models.CharField(max_length=200,null = True, blank=True, default="None")
    place = models.CharField(max_length=500)
    

