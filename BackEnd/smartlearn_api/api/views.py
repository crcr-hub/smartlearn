from django.shortcuts import render
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth.signals import user_logged_in,user_logged_out
from django.contrib.auth import authenticate

from django.db.models import Count
from django.utils.timezone import now
from courses.models import Courses
from courses.serializer import CourseSerializer
from student.models import EnrolledCourses, Order_items, StudentProfile,Notification
from student.serializer import StudentProfileSerializer
from teacher.models import TeacherProfile
from teacher.serializer import TeacherProfileSerializer
from .serializer import AdminNotificationSerializer, MyTokenObtainPairSerializer,RegisterSerializer, UserSerializer
from rest_framework import generics
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import User,UserStatus,AdminNotification
from rest_framework_simplejwt.tokens import RefreshToken
from django.dispatch import receiver
from django.shortcuts import get_object_or_404

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/token/refresh/',
    ]
    return Response(routes)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)  # Get token response
        
        username = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
       
        if user:
           
            user_logged_in.send(sender=user.__class__, request=request, user=user)
            user_status, created = UserStatus.objects.get_or_create(user=user)
            user_status.is_online = True
            user_status.last_seen = now()
            user_status.save()
        return response  # Return the token response

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        # Pass the request data to the serializer for validation and saving
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # Calls the create() method in the serializer
            return Response({"message": "User registered successfully", "user": user.username}, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@receiver(user_logged_in)
def set_online_status(sender, request, user, **kwargs):
    user_status, created = UserStatus.objects.get_or_create(user=user)
    user_status.is_online = True
    user_status.last_seen = now()
    user_status.save()



class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()  # Add the token to the blacklist
            user_logged_out.send(sender=request.user.__class__, request=request, user=request.user)
            return Response({"message": "Successfully logged out"}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)


@receiver(user_logged_out)
def update_online_status(sender,request,user,**kwargs):
    user_status, created = UserStatus.objects.get_or_create(user=user)
    user_status.is_online = False
    user_status.last_seen = now()
    user_status.save()



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def adminNotificattions(request):
    if request.method == 'GET':
        notif = AdminNotification.objects.filter(is_seen = False)
        serializer_data = AdminNotificationSerializer(notif, many=True)
        return Response(serializer_data.data, status=status.HTTP_200_OK)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pending_courses(request):
    if request.method == 'GET':
        courses = Courses.objects.filter(visible_status = 'private')
        serializer = CourseSerializer(courses, many=True)
        return Response({"courses":serializer.data}, status=status.HTTP_200_OK)
    

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_approve(request,cid):
    courses = get_object_or_404(Courses, id=cid)
    courses.visible_status = 'public'
    courses.save()
    return Response({"courses":courses.name}, status=status.HTTP_200_OK)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def clear_admin_notification(request):
    AdminNotification.objects.filter(is_seen=False).update(is_seen=True)  #  Bulk update
    return Response({"success": "success"}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_students(request):
    users_with_student_profile = User.objects.filter(studentprofile__isnull=False).exclude(email='admin@admin.com').select_related('studentprofile')

    # Serialize the users' student profiles
    serialized_users = UserSerializer(users_with_student_profile, many=True)

    combined_data = []
    for user_data, user in zip(serialized_users.data, users_with_student_profile):
        try:
            profile_data = StudentProfileSerializer(user.studentprofile).data
        except StudentProfile.DoesNotExist:
            profile_data = None  # In case of missing student profile
        
        combined_data.append({
            'user': user_data,
            'profile': profile_data
        })

    return Response(combined_data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_teachers(request):
    users_with_teacher_profile = User.objects.filter(teacherprofile__isnull=False).exclude(email='admin@admin.com').select_related('teacherprofile')

    # Serialize the users' student profiles
    serialized_users = UserSerializer(users_with_teacher_profile, many=True)

    combined_data = []
    for user_data, user in zip(serialized_users.data, users_with_teacher_profile):
        try:
            profile_data = TeacherProfileSerializer(user.teacherprofile).data
        except TeacherProfile.DoesNotExist:
            profile_data = None  # In case of missing student profile
        
        combined_data.append({
            'user': user_data,
            'profile': profile_data
        })

    return Response(combined_data, status=status.HTTP_200_OK)


@api_view(['GET', 'PUT','PATCH'])
@permission_classes([IsAuthenticated])
def handle_student(request, id):
    try:
        # Fetch the student's profile
        user = User.objects.get(id =id)
        student = StudentProfile.objects.get(user_id=id)

        if request.method == 'GET':
            # Serialize and return student data
            user_data = UserSerializer(user)
            serializer = StudentProfileSerializer(student)
            combined_data = {
            'user': user_data.data,
            'profile': serializer.data
            }
            return Response(combined_data, status=status.HTTP_200_OK)

        elif request.method == 'PUT':
            
            # Update the student with new data
            userserializer = UserSerializer(user,data=request.data, partial = True)
            profileserializer = StudentProfileSerializer(student, data=request.data, partial=True)
            if profileserializer.is_valid() and userserializer.is_valid():
                userserializer.save()
                profileserializer.save()
                return Response({  'user_errors': userserializer.errors,'profile_errors': profileserializer.errors
                }, status=status.HTTP_200_OK)
            return Response({'user_errors': userserializer.errors,'profile_errors': profileserializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        elif request.method == 'PATCH':
            # Update only specific fields
            userserializer = UserSerializer(user, data=request.data, partial=True)
            if userserializer.is_valid():
                userserializer.save()
                return Response({'message': 'Block status updated successfully'}, status=status.HTTP_200_OK)
            return Response(userserializer.errors, status=status.HTTP_400_BAD_REQUEST)


    except StudentProfile.DoesNotExist:
        return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET', 'PUT','PATCH'])
@permission_classes([IsAuthenticated])
def handle_teacher(request, id):
    try:
        # Fetch the student's profile
        user = User.objects.get(id =id)
        teacher = TeacherProfile.objects.get(user_id=id)

        if request.method == 'GET':
            print("working")
            # Serialize and return teacher data
            user_data = UserSerializer(user)
            serializer = TeacherProfileSerializer(teacher)
            combined_data = {
            'user': user_data.data,
            'profile': serializer.data
            }
            print(combined_data)
            return Response(combined_data, status=status.HTTP_200_OK)

        elif request.method == 'PUT':
            
            # Update the teacher with new data
            userserializer = UserSerializer(user,data=request.data, partial = True)
            profileserializer = TeacherProfileSerializer(teacher, data=request.data, partial=True)
            if profileserializer.is_valid() and userserializer.is_valid():
                userserializer.save()
                profileserializer.save()
                return Response({  'user_errors': userserializer.errors,'profile_errors': profileserializer.errors
                }, status=status.HTTP_200_OK)
            return Response({'user_errors': userserializer.errors,'profile_errors': profileserializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        elif request.method == 'PATCH':
            # Update only specific fields
            userserializer = UserSerializer(user, data=request.data, partial=True)
            if userserializer.is_valid():
                userserializer.save()
                return Response({'message': 'Block status updated successfully'}, status=status.HTTP_200_OK)
            return Response(userserializer.errors, status=status.HTTP_400_BAD_REQUEST)


    except TeacherProfile.DoesNotExist:
        return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)




@api_view(['GET','PUT'])
def handle_notification(request,id):
    user_id = id
    if request.method == 'GET':
        if request.user.id == user_id:
            notifications = (Notification.objects
            .filter(recipient_id=user_id,is_read = False)
            .values("sender_id", "sender__username", "notification_type") 
            .annotate(message_count=Count("id"))
            )

            # for n in notifications:
            #     print(n.notification_type)
            notification_data = []
            for n in notifications:
                sender_id = n["sender_id"]
                notification_type = n["notification_type"]
                
                # Fetch sender's first name based on whether they are a teacher or student
                sender_profile = TeacherProfile.objects.filter(user_id=sender_id).first() or \
                                StudentProfile.objects.filter(user_id=sender_id).first()

                sender_name = sender_profile.first_name if sender_profile else "Unknown"

                notification_data.append({
                    "sender_id": sender_id,
                    "sender_username": n["sender__username"],
                    "sender_first_name": sender_name,  # First name from Teacher or Student profile
                    "message_count": n["message_count"],
                    "notification_type": notification_type,
                })
            return Response({"notification":notification_data})
        # else:
        #     notifications = (Notification.objects
        #     .filter(recipient_id=user_id,is_read = False)
        #     .values("sender_id", "sender__username", "notification_type") 
        #     .annotate(message_count=Count("id"))
        #     )

        #     # for n in notifications:
        #     #     print(n.notification_type)
        #     print(notifications)
        #     notification_data = []

        #     for n in notifications:
        #         sender_id = n["sender_id"]
        #         notification_type = n["notification_type"]
                
        #         # Fetch sender's first name based on whether they are a teacher or student
        #         sender_profile = TeacherProfile.objects.filter(user_id=sender_id).first() or \
        #                         StudentProfile.objects.filter(user_id=sender_id).first()

        #         sender_name = sender_profile.first_name if sender_profile else "Unknown"

        #         notification_data.append({
        #             "sender_id": sender_id,
        #             "sender_username": n["sender__username"],
        #             "sender_first_name": sender_name,  # First name from Teacher or Student profile
        #             "message_count": n["message_count"],
        #             "notification_type": notification_type,
        #         })

        #     print(notification_data)
        #     return Response({"notification":notification_data})
    elif request.method == 'PUT':
        print("from put",user_id)
        teacher = TeacherProfile.objects.filter(id=user_id).first()
        student = StudentProfile.objects.filter(id=user_id).first()
        actual_user_id = teacher.user.id if teacher else student.user.id if student else None
        print("actual Id,",actual_user_id)
        if actual_user_id:
            unread_notifications = Notification.objects.filter(sender_id = actual_user_id,recipient_id=request.user.id)
            print("Unread Notifications Count:", unread_notifications)
            updated_count = Notification.objects.filter(sender_id=actual_user_id,recipient_id=request.user.id, is_read=False).update(is_read=True)
            print("updated",updated_count)
            return Response({"message": f"{updated_count} notifications marked as read."})
        else:
            return Response({"error": "User not found"}, status=400)
    return Response({"error": "Invalid request"}, status=400)



import razorpay
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

@csrf_exempt
def create_order(request):
    if request.method == "POST":
        data = json.loads(request.body)
        amount = data.get("amount")  # Amount in paise (100 INR = 10000 paise)
        
        order_data = {
            "amount": amount,
            "currency": "INR",
            "payment_capture": 1  # Auto-capture payment
        }
        
        order = client.order.create(data=order_data)
        
        return JsonResponse({"order_id": order["id"], "amount": amount, "currency": "INR"})



from django.utils.timezone import now
from datetime import timedelta 
from decimal import Decimal
from django.db.models.functions import TruncMonth
from django.db.models import Sum, Count  

@api_view(['GET', 'PUT','PATCH'])
@permission_classes([IsAuthenticated])
def admin_dashboard(request):
    try:
        enrolled_courses = EnrolledCourses.objects.all()
        today = now().date()

        total_revenue = 0
        last_week_revenue = 0
        today_revenue = 0
        this_month_revenue = 0
        current_week = today-timedelta(days = today.weekday())
        current_month = today.replace(day=1)

        for enrolled in enrolled_courses:
            for item in enrolled.order.all():
                total_revenue += item.Offer_price * Decimal(0.10)

                if item.order.date.date() == today:
                    today_revenue += item.Offer_price * Decimal(0.10)

                if current_week <= item.order.date.date() <= today:
                    last_week_revenue += item.Offer_price * Decimal(0.10)
                if current_month <= item.order.date.date():
                    this_month_revenue += item.Offer_price * Decimal(0.10)
        
        top_courses = (
            enrolled_courses
            .values('course__id','course__name')
            .annotate(student_count = Count('user'))
            .order_by('-student_count')[:10]
        )

        top_courses_data =[
            {
                'course_id': course['course__id'],
                'course_name':course['course__name'],
                'student_count':course['student_count']
            }
            for course in top_courses
        ]

        monthly_data=(
            enrolled_courses
            .annotate(month=TruncMonth('order__order__date'))
            .values('month')
            .annotate(
                revenue = Sum('order__Offer_price') * Decimal(0.10),
                students = Count('user',distinct=True)
            )
            .order_by('month')
        )

        monthly_revenue_students = [
            {
                'month' : entry['month'].strftime('%b') if entry['month'] else'unknown',
                'revenue': entry['revenue'] or 0,
                'students': entry['students'] or 0
            }
            for entry in monthly_data
        ]
        latest_orders = (
                    Order_items.objects
                    .select_related('order', 'course', 'order__user', 'order__user__studentprofile')
                    .order_by('-order__date')[:10]
                )

        latest_orders_data = [
                    {
                        'order_id': order_item.order.id,
                        'date': order_item.order.date.strftime('%Y-%m-%d %H:%M'),
                        'student_name': order_item.order.user.studentprofile.first_name,
                        'course_name': order_item.course.name
                    }
                    for order_item in latest_orders
                ]
        return Response({
                    'total_revenue': total_revenue,
                    'last_week_revenue': last_week_revenue,
                    'today_revenue': today_revenue,
                    'this_month' : this_month_revenue,
                    'monthly_revenue_students': monthly_revenue_students,
                    'top_courses':top_courses_data,
                    'latest_orders':latest_orders_data,
                }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(e)
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


@api_view(['GET', 'PUT','PATCH'])
@permission_classes([IsAuthenticated])
def reports_view(request, report_type):
    print("typessssss",report_type)
    """API to return reports based on selected type"""
    if report_type == "students":
        students = []
        enrolled_students = EnrolledCourses.objects.select_related("user", "course")
        
        for entry in enrolled_students:
            # Get the student's profile
            student_profile = StudentProfile.objects.filter(user=entry.user).first()

            student_name = f"{student_profile.first_name} {student_profile.last_name}" if student_profile else "Unknown"

            # Get all offer prices for this course from Order_items
            offer_price = entry.order.filter(course=entry.course).values_list("Offer_price", flat=True).first() or "N/A"

            student_data = {
                "student_name": student_name,
                "course_name": entry.course.name,
                "enrolled_date": entry.starting_date.strftime("%Y-%m-%d"),
                "offer_price": offer_price,  # Now a single value
                "teacher": entry.course.teacher.first_name if hasattr(entry.course, "teacher") else "N/A",
                "total_income": Order_items.objects.filter(course=entry.course).aggregate(Sum("Offer_price"))["Offer_price__sum"] or 0,
            }

            students.append(student_data)

        print(students)
        
        return JsonResponse({"students": students})

    elif report_type == "teachers":
        teachers = []

        all_teachers = TeacherProfile.objects.annotate(course_count=Count("courses"))
        for teacher in all_teachers:
            courses = Courses.objects.filter(teacher=teacher)
            total_students = EnrolledCourses.objects.filter(course__in=courses).count()
            
            teacher_data = {
                "teacher_name": teacher.first_name,
                "email": teacher.user.email,
                "total_students": total_students,
                "course_count": teacher.course_count,
                "courses": [
                    {
                        "course_name": course.name,
                        "course_price": course.price,
                        "offer_price": course.offer_price,
                        "total_students": EnrolledCourses.objects.filter(course=course).count(),
                    }
                    for course in courses
                ],
            }

            teachers.append(teacher_data)

        return JsonResponse({"teachers": teachers})
        # teachers = []
        # courses = Courses.objects.select_related("teacher")
        
        # for course in courses:
        #     teacher_data = {
        #         "teacher_name": course.teacher.full_name if hasattr(course, "teacher") else "N/A",
        #         "registered_date": course.teacher.user.date_joined.strftime("%Y-%m-%d") if hasattr(course.teacher, "user") else "N/A",
        #         "course_name": course.course_name,
        #         "total_students": EnrolledCourses.objects.filter(course=course).count(),
        #         "total_income": Order_items.objects.filter(course=course).aggregate(Sum("Offer_price"))["Offer_price__sum"] or 0,
        #     }
        #     teachers.append(teacher_data)
        
        # return JsonResponse({"teachers": teachers})

    elif report_type == "courses":
        courses = []
        all_courses = Courses.objects.annotate(modules_count=Count("modules"))

        for course in all_courses:
            total_students = EnrolledCourses.objects.filter(course=course).count()
            total_income = Order_items.objects.filter(course=course).aggregate(Sum("Offer_price"))["Offer_price__sum"] or 0

            course_data = {
                "course_name": course.name,
                "teacher": course.teacher.first_name if hasattr(course, "teacher") else "N/A",
                "total_students": total_students,
                "total_income": total_income,
                "modules_count": course.modules_count,  # Now correctly counted
            }
            courses.append(course_data)
        
        return JsonResponse({"courses": courses})

    return JsonResponse({"error": "Invalid report type"}, status=400)
    
        

