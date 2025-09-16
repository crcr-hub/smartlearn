from django.shortcuts import render
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth.signals import user_logged_in,user_logged_out
from django.contrib.auth import authenticate

from django.db.models import Count
from django.utils.timezone import now
from courses.models import Courses, Status
from courses.serializer import CourseSerializer, StatusSerializer
from .permission import IsAdminUserOnly
from student.models import EnrolledCourses, Order, Order_items, StudentProfile,Notification
from student.serializer import StudentProfileSerializer
from teacher.models import TeacherProfile
from teacher.serializer import TeacherProfileSerializer
from .serializer import AdminNotificationSerializer, MyTokenObtainPairSerializer,RegisterSerializer, UserSerializer,SendOTPSerializer, VerifyOTPSerializer
from rest_framework import generics
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import RegisterOTP, User,UserStatus,AdminNotification
from rest_framework_simplejwt.tokens import RefreshToken
from django.dispatch import receiver
from django.shortcuts import get_object_or_404
from .models import PasswordResetOTP
from django.contrib.auth import get_user_model
from django.core.mail import send_mail

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/token/refresh/',
        '/api/test-time/'
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
    



class UserDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = {
            "user_id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "is_superuser": user.is_superuser,
            "block_status": user.block_status,
        }

        # Check if user is a student
        if hasattr(user, 'studentprofile'):
            student_profile = user.studentprofile
            user_data.update({
                "first_name": student_profile.first_name,
                "last_name": student_profile.last_name,
                "place": student_profile.place,
                "qualification": student_profile.qualification,
                "mobile": student_profile.mobile,
            })

        # Check if user is a teacher
        if hasattr(user, 'teacherprofile'):
            teacher_profile = user.teacherprofile
            user_data.update({
                "profile_id": teacher_profile.id,
                "first_name": teacher_profile.first_name,
                "last_name": teacher_profile.last_name,
                "place": teacher_profile.place,
                "gender": teacher_profile.gender,
                "qualification": teacher_profile.qualification,
                "experience": teacher_profile.experience,
                "experience_in": teacher_profile.experience_in,
            })

        return Response(user_data)


# user Registration
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        # Pass the request data to the serializer for validation and saving
        # email = request.data.get('email')
        # if User.objects.filter(email=email).exists():
        #     return Response({"error": "You are already Rigistered with us"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # Calls the create() method in the serializer
            return Response({"user": user.username,"message": "Registered successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# checking email and sending OTP for user registration
import random

def generate_otp():
    return str(random.randint(100000, 999999))  # 6-digit OTP



class send_otp(APIView):
    def post(self,request):
        serializer = SendOTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]

            # Generate OTP
            otp_code = generate_otp()

            # Save OTP
            otp_obj = RegisterOTP.objects.create(email=email, otp_code=otp_code)

            # Send OTP via email
            send_mail(
                "Your OTP Code",
                f"Your OTP code is {otp_code}. It will expire in 5 minutes.",
                "noreply@example.com",
                [email],
                fail_silently=True,
            )

            return Response(
                {"message": "OTP sent to email", "session_id": str(otp_obj.session_id),"email":email},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# verifying otp that sent for user registration

class verifyRegisterOtp(APIView):
    def post(self,request):
        serializer = VerifyOTPSerializer(data = request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']
            try:
                otp_obj = RegisterOTP.objects.filter(email=email).latest("created_at")
            except RegisterOTP.DoesNotExist:
                return Response({"error":"OTP Not Found"}, status=status.HTTP_404_NOT_FOUND)
            if otp_obj.otp_code != otp:
                return Response({"error":"Invalid OTP"},status=status.HTTP_400_BAD_REQUEST)
            if otp_obj.is_expired():
                return Response({"error":"OTP Expired"},status=status.HTTP_400_BAD_REQUEST)
            
            otp_obj.is_verified = True
            otp_obj.save()
            return Response({"status":"Verified","Session_id":str(otp_obj.session_id),"email":otp_obj.email},status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)




User = get_user_model()
# sending otp for forget password
class SendOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            otp_instance = PasswordResetOTP.objects.create(user=user)
           
            send_mail(
                'Your OTP for Password Reset',
                f'Your OTP is {otp_instance.otp}',
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )
            return Response({'message':otp_instance.otp }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User with this email does not exist'}, status=status.HTTP_404_NOT_FOUND)


class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        try:
            user = User.objects.get(email=email)
            otp_instance = PasswordResetOTP.objects.filter(user=user, otp=otp, is_verified=False).latest('created_at')
            otp_instance.is_verified = True
            otp_instance.save()
            return Response({'message': 'OTP verified'}, status=status.HTTP_200_OK)
        except (User.DoesNotExist, PasswordResetOTP.DoesNotExist):
            return Response({'error': 'Invalid OTP or Email'}, status=status.HTTP_400_BAD_REQUEST)


from django.contrib.auth.hashers import make_password

class ResetPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        new_password = request.data.get('password')
        
        try:
            user = User.objects.get(email=email)
            otp_verified = PasswordResetOTP.objects.filter(user=user, is_verified=True).exists()

            if otp_verified:
                user.password = make_password(new_password)
                user.save()
                return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'OTP not verified'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)


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



class AdminNotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Retrieve all admin notifications that are not seen
        notifications = AdminNotification.objects.filter(is_seen=False)
        serializer = AdminNotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)




class PendingCoursesView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserOnly]
    def get(self, request):
        courses = Courses.objects.exclude(Q(visible_status='public') 
                                          | Q(visible_status='private') | 
                                          Q(visible_status='Private') |
                                          Q(visible_status='Public'))
        serializer = CourseSerializer(courses, many=True)
        return Response({"courses": serializer.data}, status=status.HTTP_200_OK)
    




class ApproveCourseView(APIView):
    permission_classes = [IsAuthenticated,IsAdminUserOnly]
    def patch(self, request, cid):
        course = get_object_or_404(Courses, id=cid)
        course.visible_status = 'Public'
        course.save()
        Status.objects.create(
            course=course,
            course_status='Public',
            reason=None,
            required=None
        )
        return Response({"courses": course.name}, status=status.HTTP_200_OK)


class StatusCourseView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, cid):
        course = get_object_or_404(Courses, id=cid)
        course.visible_status = request.data.get('course_status')
        course.save()
        data = request.data.copy()
        data['course'] = course.id  # include course foreign key
        serializer = StatusSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            
            return Response({"course": course.name}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class ClearAdminNotificationView(APIView):
    permission_classes = [IsAuthenticated]
    def patch(self, request, *args, **kwargs):
        AdminNotification.objects.filter(is_seen=False).update(is_seen=True)
        return Response({"success": "success"}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_students(request):
    users_with_student_profile = User.objects.filter(studentprofile__isnull=False).exclude(email='admin@admin.com').select_related('studentprofile')

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
        user = User.objects.get(id =id)
        teacher = TeacherProfile.objects.get(user_id=id)

        if request.method == 'GET':
            user_data = UserSerializer(user)
            serializer = TeacherProfileSerializer(teacher)
            combined_data = {
            'user': user_data.data,
            'profile': serializer.data
            }
       
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

import logging
logger = logging.getLogger(__name__)



@api_view(['GET','PUT'])
@permission_classes([IsAuthenticated])
def handle_notification(request,id):
    user_id = int(id)
    
    if request.method == 'GET':
        if request.user.id == user_id:
            logger.debug(f"DEBUG - request.user: {request.user}")
            logger.debug(f"DEBUG - request.user.is_authenticated: {request.user.is_authenticated}")
            logger.debug(f"DEBUG - request headers: {request.headers}")
            user = request.user
            notifications = (Notification.objects
            .filter(recipient=user,is_read = False)
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
       
    elif request.method == 'PUT':
        teacher = TeacherProfile.objects.filter(id=user_id).first()
        student = StudentProfile.objects.filter(id=user_id).first()
        actual_user_id = teacher.user.id if teacher else student.user.id if student else None
        if actual_user_id:
            unread_notifications = Notification.objects.filter(sender_id = actual_user_id,recipient_id=request.user.id)
            updated_count = Notification.objects.filter(sender_id=actual_user_id,recipient_id=request.user.id, is_read=False).update(is_read=True)

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


class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated,IsAdminUserOnly]
    def get(self, request):
        try:
            today = now().date()
            # Initialize revenue and statistics trackers
            total_revenue = 0
            last_week_revenue = 0
            today_revenue = 0
            this_month_revenue = 0

            # Calculate the current week (Sunday to Sunday)
            current_week_start = today - timedelta(days=today.weekday())  # Last Sunday
            current_month_start = today.replace(day=1)  # First day of the current month

            # Query for all orders
            orders = Order.objects.all()

            # Loop through each order and its related order items
            for order in orders:
                # Access the related order_items using the reverse relation
                order_items = Order_items.objects.filter(order=order)

                for order_item in order_items:
                    # Total revenue (admin share 10%)
                    total_revenue += order_item.Offer_price * Decimal(0.10)

                    # Today's revenue (admin share 10%)
                    if order.date.date() == today:
                        today_revenue += order_item.Offer_price * Decimal(0.10)

                    # Last week's revenue (last Sunday to this Sunday)
                    if current_week_start <= order.date.date() <= today:
                        last_week_revenue += order_item.Offer_price * Decimal(0.10)

                    # This month's revenue (admin share 10%)
                    if current_month_start <= order.date.date():
                        this_month_revenue += order_item.Offer_price * Decimal(0.10)

            # Top 10 courses by number of orders
            top_courses = (
                Order_items.objects
                .values('course__id', 'course__name')
                .annotate(student_count=Count('order__user', distinct=True))
                .order_by('-student_count')[:10]
            )

            top_courses_data = [
                {
                    'course_id': course['course__id'],
                    'course_name': course['course__name'],
                    'student_count': course['student_count']
                }
                for course in top_courses
            ]

            # Monthly data (Revenue and number of students per month)
            monthly_data = (
                Order_items.objects
                .annotate(month=TruncMonth('order__date'))
                .values('month')
                .annotate(
                    revenue=Sum('Offer_price') * Decimal(0.10),
                    students=Count('order__user', distinct=True)
                )
                .order_by('month')
            )

            monthly_revenue_students = [
                {
                    'month': entry['month'].strftime('%b') if entry['month'] else 'unknown',
                    'revenue': entry['revenue'] or 0,
                    'students': entry['students'] or 0
                }
                for entry in monthly_data
            ]

            # Latest Orders (fetch the last 10 orders)
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

            # Return the aggregated data as a response
            return Response({
                'total_revenue': total_revenue,
                'last_week_revenue': last_week_revenue,
                'today_revenue': today_revenue,
                'this_month': this_month_revenue,
                'monthly_revenue_students': monthly_revenue_students,
                'top_courses': top_courses_data,
                'latest_orders': latest_orders_data,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PUT','PATCH'])
@permission_classes([IsAuthenticated])
def reports_view(request, report_type):
    """API to return reports based on selected type"""
    if report_type == "students":
        students = []
        registered_users = User.objects.select_related("studentprofile")
        for st in registered_users:
            course_count = EnrolledCourses.objects.filter(user=st).count()
            student = getattr(st, "studentprofile", None)
            if student is None:
                continue 
            student_data = {
                "student_name": f"{student.first_name} {student.last_name}",
                "no_course" : course_count,
                "register_date": student.date,

            }
            students.append(student_data)

        return JsonResponse({"students": students})

    elif report_type == "teachers":
        teachers = []
        all_teachers = TeacherProfile.objects.annotate(course_count=Count("courses"))
        for teacher in all_teachers:
            courses = Courses.objects.filter(teacher=teacher)
            total_students = EnrolledCourses.objects.filter(course__in=courses).count()
            
            teacher_data = {
                "teacher_name":  f"{teacher.first_name} {teacher.last_name}",
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
    
from django.db.models import Count, F, ExpressionWrapper, DecimalField,Value, Q
from django.db.models.functions import Coalesce

@api_view(['GET'])
def tutorTransaction(request,tid):
    user = get_object_or_404(User, id=tid)
   
    teacher = get_object_or_404(TeacherProfile, user = user)
   # Fetch all courses for the teacher
    courses = Courses.objects.filter(teacher=teacher,visible_status = 'public').annotate(
    purchase_count=Count('order_items'),
    total_revenue=Coalesce(Sum('order_items__Offer_price'), Value(0), output_field=DecimalField()),
    teacher_share=ExpressionWrapper(
        F('total_revenue') * Decimal('0.9'),
        output_field=DecimalField(max_digits=10, decimal_places=2)
    ),
    admin_share=ExpressionWrapper(
        F('total_revenue') * Decimal('0.1'),
        output_field=DecimalField(max_digits=10, decimal_places=2)
    )
    )

    total_teacher_share = courses.aggregate(total=Sum('teacher_share'))['total'] or 0
    total_admin_share = courses.aggregate(total=Sum('admin_share'))['total'] or 0
    # Prepare the response data
    response_data = [
        {
            'course_id': course.id,
            'course_name': course.name,
            'purchase_count': course.purchase_count,
            'offer_price': course.offer_price,
            'total_revenue': course.total_revenue,
            'teacher_share': course.teacher_share,
            'admin_share': course.admin_share,
        }
        for course in courses
    ]

    grand_totals = {
        "total_teacher_share": total_teacher_share,
        "total_admin_share": total_admin_share
    }

    return Response({
        "courses": response_data,
        "grand_totals": grand_totals
    })
        


class SingleStudentTransaction(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, sid):
        try:
            # Get all orders made by the student
            student = StudentProfile.objects.get(id=sid)
            student_name = student.first_name + " " + student.last_name
            user = student.user
            orders = Order.objects.filter(user=user)
           
            order_items = Order_items.objects.filter(order__in=orders).select_related('course')
            grand_total_price = Decimal(0)
            grand_teacher_share = Decimal(0)
            grand_admin_share = Decimal(0)
            
            data = []
            for item in order_items:
                data.append({
                    'course_name': item.course.name,
                    'offer_price': item.Offer_price,
                    'teacher_name':item.course.teacher.first_name + ' ' + item.course.teacher.last_name,
                    'payment_type' :item.order.payment_type,
                    'teacher_share': item.Offer_price * Decimal(0.90),
                    'admin_share': item.Offer_price * Decimal(0.10),
                    'ordered_at': item.created_at.strftime('%Y-%m-%d %H:%M'),
                })
                grand_total_price += item.Offer_price
                grand_teacher_share += item.Offer_price * Decimal(0.90)
                grand_admin_share += item.Offer_price * Decimal(0.10)

            return Response({'student_id': sid, 'transactions': data,
                              'grand_totals': {
                                  'student_name':student_name,
                    'grand_total_price': grand_total_price,
                    'grand_teacher_share': grand_teacher_share,
                    'grand_admin_share': grand_admin_share
                }
                             }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminTransactions(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            order_items = Order_items.objects.select_related(
                'order', 'order__user', 'order__user__studentprofile'
            ).all()

            student_transactions = {}

            # Grand totals
            grand_total_price = Decimal(0)
            grand_teacher_share = Decimal(0)
            grand_admin_share = Decimal(0)
            

            for order_item in order_items:
                order = order_item.order
                student = order.user.studentprofile

                if student.id not in student_transactions:
                    student_transactions[student.id] = {
                        'student_id':student.id,
                        'student_name': student.first_name + " " + student.last_name,
                        'total_courses': 0,
                        'total_price': Decimal(0),
                        'teacher_share': Decimal(0),
                        'admin_share': Decimal(0),
                    }

                # Update per-student
                student_transactions[student.id]['total_courses'] += 1
                student_transactions[student.id]['total_price'] += order_item.Offer_price
                teacher_share = order_item.Offer_price * Decimal(0.90)
                admin_share = order_item.Offer_price * Decimal(0.10)
                student_transactions[student.id]['teacher_share'] += teacher_share
                student_transactions[student.id]['admin_share'] += admin_share

                # Update grand totals
                grand_total_price += order_item.Offer_price
                grand_teacher_share += teacher_share
                grand_admin_share += admin_share

            student_transactions_list = list(student_transactions.values())

            return Response({
                'student_transactions': student_transactions_list,
                'grand_totals': {
                    'grand_total_price': grand_total_price,
                    'grand_teacher_share': grand_teacher_share,
                    'grand_admin_share': grand_admin_share
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from django.utils.timezone import localtime, now
def test_time(request):
    current_time = localtime(now())  # Will reflect TIME_ZONE setting
    return JsonResponse({
        'server_time': current_time.strftime('%Y-%m-%d %H:%M:%S')
    })