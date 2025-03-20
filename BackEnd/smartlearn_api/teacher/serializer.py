from rest_framework import serializers
from teacher.models import TeacherProfile

class TeacherProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherProfile
        fields = ['id','first_name','last_name','gender','qualification','experience','experience_in','place']