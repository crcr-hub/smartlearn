from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from teacher.models import TeacherProfile
from student.models import StudentProfile
from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
from api.models import User,AdminNotification
import re

# User = get_user_model()
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role','block_status')

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        if user.block_status and user.role == 'teacher':
            raise AuthenticationFailed({
                "detail": "please contact the administrator for further assistance.",
                "title":"Account Pending Approval",
            })
        elif user.block_status:
             raise AuthenticationFailed({
                "detail": "Please contact the administrator for further assistance.",
                "title":"Account Blocked",
            })
        token = super().get_token(user)
        return token  


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    block_status = serializers.BooleanField(required = False)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    gender = serializers.CharField(required=True)
    place = serializers.CharField(required=True)
    mobile = serializers.CharField(required=False)
    qualification = serializers.CharField(required=True)
    experience = serializers.CharField(required=False)
    experience_in = serializers.CharField(required = False)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password2', 'block_status','role', 'first_name', 'last_name', 'gender', 'place', 'mobile', 'qualification', 'experience','experience_in')

    def validate_first_name(self, value):
        if not re.search(r'[a-zA-Z]', value):
            raise serializers.ValidationError("First name must contain at least one alphabet.")
        return value

    def validate_last_name(self, value):
        if not re.search(r'[a-zA-Z]', value):
            raise serializers.ValidationError("Last name must contain at least one alphabet.")
        return value
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password Fields Didn't Match"})
        
        if len(set(attrs['password'])) == 1:
            raise serializers.ValidationError({"password": "Password can't be all the same character."})
        return attrs
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email is already registered.")
        return value


    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            role=validated_data.get('role', 'student'),
            block_status = validated_data.get('block_status', False),
        )

        user.set_password(validated_data['password'])
        user.save()  # Signal will now handle the creation of the StudentProfile
        if validated_data['role'] == 'student':
            student_profile = StudentProfile.objects.create(
                user=user,
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                gender=validated_data['gender'],
                qualification=validated_data['qualification'],
                mobile=validated_data['mobile'],
                place=validated_data['place'],
            )
            student_profile.save()
        elif validated_data['role'] == 'teacher':
            teacher_profile = TeacherProfile.objects.create(
                user=user,
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                gender=validated_data['gender'],
                qualification=validated_data['qualification'],
                place=validated_data['place'],
                experience=validated_data['experience'],
                experience_in = validated_data['experience_in']
            )
            teacher_profile .save()
           

        return user

class AdminNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminNotification
        fields = ['id','sender','course','message','timestamp','is_seen']
