
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from api.models import AdminNotification
from student.models import Cart, EnrolledCourses, StudentProfile,Notification, Wishlist
from student.serializer import StudentProfileSerializer
from teacher.models import TeacherProfile
from teacher.serializer import TeacherProfileSerializer
from rest_framework import generics
from rest_framework import status
from django.http import QueryDict
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializer import CategorySerializer,CourseSerializer,ModuleSerializer, StatusSerializer
from .models import Category,Courses,Modules, RatingStar, Status
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.db.models import Avg
from django.core.files.storage import default_storage 
from .task import process_video_for_s3

import os
import boto3
import subprocess
from celery import shared_task
from django.conf import settings
import logging

logger = logging.getLogger(__name__)
s3_client = boto3.client(
    "s3",
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_REGION
)
# Create your views here.



class CategoryView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]
    def post(self, request):
        """Create a new category"""
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        """Retrieve all categories"""
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class CourseView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]
    def post(self, request):
        """Create a new Courses"""
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            course = serializer.save()
            status_data = {'course': course.id} 
            status_serializer = StatusSerializer(data=status_data)
            logger.debug(f"Status Serializer: {status_serializer}")
            if status_serializer.is_valid():
                status_serializer.save()
            else:
                logger.error(f"Status Serializer Errors: {status_serializer.errors}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        """Retrieve all Courses"""
        courses = Courses.objects.filter(visible_status__iexact='public')
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CourseStatus(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,cid):
        status_data = Status.objects.filter(course= cid)
        if not status_data.exists():
            return Response({"message": "No status data found for this course."}, status=status.HTTP_404_NOT_FOUND)
        serializer = StatusSerializer(status_data, many=True)
        return Response(serializer.data, status = status.HTTP_200_OK)

class CourseByTeacherView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, teacher_id):
        
        user = request.user
        teacher = TeacherProfile.objects.get(user = user)
        if teacher_id == teacher.id:
            courses = Courses.objects.filter(teacher=teacher) 
            serializer = CourseSerializer(courses, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    
@api_view(['GET', 'PUT','PATCH'])
@permission_classes([IsAuthenticated])
def handle_category(request, id):
    try:
        category = Category.objects.get(id =id)
        if request.method == 'GET':
            serializer = CategorySerializer(category)
            cat_data = {
            'category': serializer.data
            }
            return Response(cat_data, status=status.HTTP_200_OK)
        elif request.method == 'PUT':
            serializer = CategorySerializer(category,data=request.data, partial = True)
            if serializer.is_valid():
                serializer.save()
                return Response({  'user_errors':serializer.errors}, status=status.HTTP_200_OK)
            return Response({'user_errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    except Category.DoesNotExist:
        return Response({'error': 'category not found'}, status=status.HTTP_404_NOT_FOUND)
    return Response({'error': 'category not found'}, status=status.HTTP_404_NOT_FOUND)



class StudentCourse(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,cid):
        user = request.user
        try:
            course = Courses.objects.select_related('teacher').get(id = cid)
        except Courses.DoesNotExist:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
        in_wishlist = Wishlist.objects.filter(user = user,course = course).exists()
        in_cart = Cart.objects.filter(user = user,course = course).exists()
        in_enrolled = EnrolledCourses.objects.filter(user = user,course = course).exists()
        tutor = course.teacher
        if tutor.user.block_status:
            teacher_name = 'Unavailable'
        else:
            teacher_name = f"{tutor.first_name} {tutor.last_name}"
        serializer = CourseSerializer(course)
        course_data = {
            'course': serializer.data,
            'teacher_name':teacher_name,
            'in_wishlist':in_wishlist,
            'in_cart':in_cart,
            "is_enrolled":in_enrolled
            }
        return Response(course_data, status=status.HTTP_200_OK)
        

@api_view(['GET', 'PUT','PATCH'])
@permission_classes([IsAuthenticated])
def handle_courses(request, cid):
    parser_classes = [MultiPartParser, FormParser]
    try:
        course = Courses.objects.get(id = cid)
        if request.method == 'GET':
            serializer = CourseSerializer(course)
            course_data = {
            'course': serializer.data
            }
            return Response(course_data, status=status.HTTP_200_OK)
        elif request.method == 'PUT':
           
            #Update the category with new data
            serializer = CourseSerializer(course,data=request.data, partial = True)
            if serializer.is_valid():
                serializer.save()
                print(serializer.errors)
                return Response({  'course_errors':serializer.errors}, status=status.HTTP_200_OK)
            print(serializer.errors)
            return Response({'course_errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    except Category.DoesNotExist:
        print(serializer.errors)
        return Response({'error': 'course not found'}, status=status.HTTP_404_NOT_FOUND)
    return Response({'error': 'course not found'}, status=status.HTTP_404_NOT_FOUND)




class PublishCourseView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, cid):
        course = get_object_or_404(Courses, id=cid)

        # Set visible status
        course.visible_status = 'waiting' 
        course.save()
        status_data = {'course': course.id,'course_status':'Waiting'} 
        status_serializer = StatusSerializer(data=status_data)
        if status_serializer.is_valid():
            status_serializer.save()
        else:
            print(status_serializer.errors)
        AdminNotification.objects.create(
            sender=request.user,
            course=course,
            message=f"New course '{course.name}' submitted for approval."
        )

        return Response({
            "success": "Course published successfully",
            "status": course.visible_status
        }, status=status.HTTP_200_OK)


import uuid
@api_view(['GET','PUT'])
@permission_classes([IsAuthenticated])
def get_module(request,id):
    try:
        # Filter modules by course foreign key
        if request.method == 'GET':
            modules = Modules.objects.filter(course=id)
            # if not modules.exists():
            #     return Response({"message": "No modules found for this course."}, status=404)
                
            serializer = ModuleSerializer(modules, many=True)
            return Response(serializer.data)
        elif request.method == 'PUT':
            module_id = id  # Get module ID from request data
            try:
                module = Modules.objects.get(id=module_id)
            except Modules.DoesNotExist:
                return Response({"message": "Module not found."}, status=404)

            # Check if a new video file is uploaded
            new_media = request.FILES.get("media")
            video_path = None
            if new_media and module.media:
                
                bucket_name = settings.AWS_STORAGE_BUCKET_NAME
                module_folder = f"{module_id}/"
                objects_to_delete = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=module_folder)
                if "Contents" in objects_to_delete:
                    delete_keys = [{"Key": obj["Key"]} for obj in objects_to_delete["Contents"]]
                    s3_client.delete_objects(Bucket=bucket_name, Delete={"Objects": delete_keys})

                
                video_path = default_storage.save(f"videos/{new_media.name}", new_media)
                module.media = None
                module.total_time = None
                module.save(update_fields=['media', 'total_time'])

                # Convert request.data to a mutable dictionary (avoid copying files)
            mutable_data = request.data
           
                # Remove 'media' from mutable_data to avoid validation issues
            if new_media:
                mutable_data = request.data.dict() if isinstance(request.data, QueryDict) else dict(request.data)
                mutable_data.pop("media", None)
            

            serializer = ModuleSerializer(module, data=mutable_data, partial=True)
            if serializer.is_valid():
                serializer.save()
               
                if new_media:
                    module.video_path = video_path  # Store temp file path
                    module.save(update_fields=['video_path'])
                    process_video_for_s3.delay(module_id) 
                return Response(serializer.data)
            else:
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
       
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=500)
    


def delete_s3_folder(module_id):
    """Deletes all files in the S3 folder for a specific module"""
    try:
        bucket_name = settings.AWS_STORAGE_BUCKET_NAME
        prefix = f"{module_id}/"  # The folder name based on module ID

        # List all objects in the folder
        objects_to_delete = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
        if "Contents" in objects_to_delete:
            delete_keys = [{"Key": obj["Key"]} for obj in objects_to_delete["Contents"]]
            s3_client.delete_objects(Bucket=bucket_name, Delete={"Objects": delete_keys})
        else:
            print(f"No files found in S3 folder: {prefix}")

    except Exception as e:
        print(f"Error deleting S3 folder: {e}")


class ModuleView(APIView):
    def options(self, request, *args, **kwargs):
        """Handle preflight CORS request"""
        response = Response()
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return response
    def post(self, request):
        """Create a new Module and trigger Celery for video processing"""
        
        # Check if a video file is uploaded
        video_file = request.FILES.get("media")
        print("okkkkkk video file",video_file)
        if not video_file:
            return Response({"error": "Video file is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Save the uploaded file temporarily
        video_path = default_storage.save(f"videos/{video_file.name}", video_file)
        # Convert request.data to a mutable dictionary (avoid copying files)
        mutable_data = request.data.dict() if isinstance(request.data, QueryDict) else dict(request.data)

        # Remove 'media' from mutable_data to avoid validation issues
        mutable_data.pop("media", None)  
        # Serialize data (without media)
        serializer = ModuleSerializer(data=mutable_data, context={'request': request})
        if serializer.is_valid():
            module = serializer.save()
            module.video_path = video_path  # Store temp file path
            module.save(update_fields=['video_path'])

            # 🔹 Trigger Celery to process and upload video
            print("from here")
            process_video_for_s3.delay(module.id)
            return Response({
                "message": "Module created. Video processing in background.",
                "module_id": module.id
            }, status=status.HTTP_201_CREATED)
        
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        """Retrieve all modules"""
        module = Modules.objects.all()
        serializer = CourseSerializer(module, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def avarage_rating(request,cid):
    if request.method == 'GET':
        avg_rating = RatingStar.objects.filter(course_id=cid).aggregate(Avg('star'))['star__avg']

        # If there are no ratings, set avg_rating to 0
        avg_rating = avg_rating if avg_rating else 0
        print("average Rating",avg_rating)

        return Response({"average_rating": round(avg_rating, 2)}, status=200)
    
    

