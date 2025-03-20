from rest_framework import serializers
from .models import Category,Courses,Modules,RatingStar
from api.models import User
from teacher.models import TeacherProfile
from student.models import StudentProfile
from django.conf import settings
from django.core.files.storage import default_storage 

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id','title','description','visible_status']

class CourseSerializer(serializers.ModelSerializer):
    # category = serializers.PrimaryKeyRelatedField(queryset = Category.objects.all())
    category_title = serializers.CharField(source='category.title', read_only=True)
    teacher = serializers.PrimaryKeyRelatedField(queryset = TeacherProfile.objects.all())
    images = serializers.ImageField(required=False)
    class Meta:
        model = Courses
        fields = ['id','category','category_title','cover_text','teacher','name','description','requirements','images','date_created','price'
                  ,'offer_price','visible_status']
    

class ModuleSerializer(serializers.ModelSerializer):
    course = serializers.PrimaryKeyRelatedField(queryset =Courses.objects.all() )
    class Meta:
        model = Modules
        fields = ['id', 'number', 'course', 'topic', 'sub_topic', 'media', 'total_time', 'video_path','processing_status']  # Include `video_path`

    def create(self, validated_data):
        """Override create to support video file uploads"""

        video_file = self.context['request'].FILES.get('media')  # Get uploaded file
        if video_file:
            video_path = default_storage.save(f"videos/{video_file.name}", video_file)
            validated_data['video_path'] = video_path  # Store temp file path

        return super().create(validated_data)
    # def get_image_url(self, obj):
    #     print(obj)
    #     if obj.image:
    #         return settings.BASE_URL + obj.image.url
    #     return None
    # def update(self, instance, validated_data):
    #     image = validated_data.pop('image', None)
    #     if image is not None:
    #         instance.image = image
            
    #     for attr, value in validated_data.items():
    #         setattr(instance, attr, value)
            
    #     instance.save()
    #     return instance

class RatingSerializer(serializers.ModelSerializer):
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()
    class Meta:
        model = RatingStar
        fields = ['id','course','user','star','first_name', 'last_name','feedback','created_at']
    def get_first_name(self, obj):
        student_profile = StudentProfile.objects.filter(user=obj.user).first()
        return student_profile.first_name if student_profile else None

    def get_last_name(self, obj):
        student_profile = StudentProfile.objects.filter(user=obj.user).first()
        return student_profile.last_name if student_profile else None