from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from teacher.models import TeacherProfile
from student.models import StudentProfile
from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
from api.models import User,AdminNotification

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
                "detail": "Your account is pending approval. Please contact the administrator.",
                "block_status": user.block_status,
                "role": user.role,
            })
        token = super().get_token(user)
        
        # These are claims, you can add custom claims

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        token['is_superuser'] = user.is_superuser
        token['role'] = user.role
        token['block_status'] = user.block_status

        # Check if the user has a StudentProfile
        try:
            student_profile = user.studentprofile  # Assuming OneToOneField relation
            token['fullsss_name'] = student_profile.full_name
            token['place'] = student_profile.address
            token['image'] = str(student_profile.image)
            token['verified'] = student_profile.verified
        except AttributeError:
            # If no StudentProfile is found, you can handle it here
            token['full_name'] = None
            token['place'] = None
            token['image'] = None
            token['verified'] = None
        # Check for TeacherProfile
        

        if hasattr(user, 'teacherprofile'):
            teacher_profile = user.teacherprofile
            token['profile_id'] = teacher_profile.id
            token['teacher_first_name'] = teacher_profile.first_name
            token['teacher_last_name'] = teacher_profile.last_name
            token['place'] = teacher_profile.place
            token['gender'] = teacher_profile.gender
            token['qualification'] = teacher_profile.qualification
            token['experience'] = teacher_profile.experience
            token['experience_in'] = teacher_profile.experience_in
           
        else:
            token['profile_id'] = None
            token['teacher_first_name'] = None
            token['teacher_last_name'] = None
            token['teacher_verified'] = None
            token['teacher_image'] = None
            token['place'] = None
            token['gender'] = None
            token['qualification'] = None
            token['experience'] = None
            token['experience_in'] = None
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

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password Fields Didn't Match"})
        return attrs

    def create(self, validated_data):
        print("Creating user...")

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
