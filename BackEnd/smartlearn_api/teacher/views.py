from django.shortcuts import get_object_or_404, render
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializer import TeacherProfileSerializer
from .models import TeacherProfile
from courses.models import Courses
from courses.serializer import CourseSerializer
from student.models import EnrolledCourses, Order_items,StudentProfile
from student.serializer import EnrolledCourseSerializer, StudentProfileSerializer
from api.models import AdminNotification
from api.serializer import UserSerializer
# Create your views here.




class ListAllTeachers(APIView):
    def get(self, request):
        try:
            teachers = TeacherProfile.objects.all()
            if not teachers.exists():
                return Response({"message": "No teachers found."}, status=status.HTTP_404_NOT_FOUND)

            serializer = TeacherProfileSerializer(teachers, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TeacherProfileDetail(APIView):
    permission_classes = [AllowAny]
    def get(self, request, tid):
        try:
            user = request.user
            teacher = TeacherProfile.objects.get(user=user)
            serializer = TeacherProfileSerializer(teacher)
            user_serializer = UserSerializer(teacher.user)
            return Response({
                "teacher": serializer.data,
                "user": user_serializer.data
            }, status=status.HTTP_200_OK)

        except TeacherProfile.DoesNotExist:
            return Response({"message": "No teacher found."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




from django.contrib.auth import get_user_model

User = get_user_model()

class GetCourseTutor(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            teacher = TeacherProfile.objects.get(user=request.user)
        except TeacherProfile.DoesNotExist:
            return Response({"error": "Teacher profile not found"}, status=status.HTTP_404_NOT_FOUND)

        courses = Courses.objects.filter(teacher=teacher)
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



class GetTutorStudents(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, sid):
        try:
            teacher_profile = TeacherProfile.objects.get(user=request.user)
            course = Courses.objects.filter(id=sid, teacher=teacher_profile).first()
            if not course:
                return Response({"error": "Course not found or not authorized."}, status=status.HTTP_404_NOT_FOUND)

            enrolled_students = EnrolledCourses.objects.filter(course=course).select_related('user')
            serializer = EnrolledCourseSerializer(enrolled_students, many=True)
            data = serializer.data

            # Inject first_name and last_name from StudentProfile into each item
            for i, enrolled in enumerate(enrolled_students):
                profile = getattr(enrolled.user, 'studentprofile', None)
                if profile:
                    data[i]['student_id'] = profile.id
                    data[i]['first_name'] = profile.first_name
                    data[i]['last_name'] = profile.last_name
                else:
                    data[i]['student_id'] = ""
                    data[i]['first_name'] = ""
                    data[i]['last_name'] = ""

            return Response(data, status=status.HTTP_200_OK)

        except TeacherProfile.DoesNotExist:
            return Response({"error": "Teacher not found."}, status=status.HTTP_404_NOT_FOUND)



@api_view(['GET'])
def get_tutors_student(request):
    if request.user.role != 'teacher':
        return Response({"error": "User is not a teacher"}, status=403)
    
    try:
        teacher_profile = TeacherProfile.objects.get(user=request.user)
    except TeacherProfile.DoesNotExist:
        return Response({"error": "Teacher profile not found"}, status=404)
    # Fetch enrolled courses for the user

    enrolled_students = EnrolledCourses.objects.filter(
        course__teacher=teacher_profile).select_related('user', 'course')

    students_data = {}

    for enrollment in enrolled_students:
        student_profile = StudentProfile.objects.filter(user=enrollment.user).first()
    
        if student_profile:
            if student_profile.id not in students_data:
                students_data[student_profile.id] = {
                    "student_id": student_profile.id,
                    "first_name": student_profile.first_name,
                    "last_name": student_profile.last_name,
                    "courses": []  # Store courses inside a list
                }
            
            # Append course details to the existing student entry
            students_data[student_profile.id]["courses"].append({
                "course_id": enrollment.course.id,
                "course_name": enrollment.course.name
            })

    # Convert dictionary values to a list for response
    students_data_list = list(students_data.values())
    print(students_data_list)

    return Response(students_data_list)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    try:
        if request.method == 'GET':
            user = request.user
            profile = TeacherProfile.objects.get(user=user)
            serializer =TeacherProfileSerializer(profile)
            return Response(serializer.data, status=200)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    



class GetTeacherProfile(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            user = request.user
            profile = TeacherProfile.objects.get(user=user)
            serializer = TeacherProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except TeacherProfile.DoesNotExist:
            return Response({'error': 'Teacher profile not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self,request):
        user = request.user
        print(request.data)
        try:
            profile_data = TeacherProfile.objects.get(user = user)
        except TeacherProfile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = TeacherProfileSerializer(profile_data,data = request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        


from django.utils.timezone import now
from datetime import timedelta 
from decimal import Decimal
from django.db.models.functions import TruncMonth
from django.db.models import Sum, Count
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def tutor_dashboard(request):
    try:
        if request.method == 'GET':
            user = request.user  
            profile = TeacherProfile.objects.get(user = user)
            enrolled_courses = EnrolledCourses.objects.filter(course__teacher=profile)

            today = now().date()

            last_week_start = today - timedelta(days=7)
            total_revenue = 0
            last_week_revenue = 0
            today_revenue = 0
            this_month_revenue = 0
            current_week = today - timedelta(days=today.weekday())
            current_month = today.replace(day=1)

      
            for enrolled in enrolled_courses:
                for item in enrolled.order.all():
                    total_revenue += item.Offer_price * Decimal(0.90)  # Total revenue

                    if item.order.date.date() == today:   # Today's revenue
                        today_revenue += item.Offer_price * Decimal(0.90)

                    if current_week <= item.order.date.date() <= today:  # Only include this week's revenue
                        last_week_revenue += item.Offer_price * Decimal(0.90)
                    if current_month <= item.order.date.date() :
                        this_month_revenue += item.Offer_price * Decimal(0.90)

          
            top_courses = (
                enrolled_courses
                .values('course__id', 'course__name')  # Get course details
                .annotate(student_count=Count('user'))
                .order_by('-student_count')[:10]  # Get top 10
            )

            top_courses_data = [
                {
                    'course_id': course['course__id'],
                    'course_name': course['course__name'],
                    'student_count': course['student_count']
                }
                for course in top_courses
            ]

            monthly_data = (
                enrolled_courses
                .annotate(month=TruncMonth('order__order__date'))
                .values('month')
                .annotate(
                    revenue = Sum('order__Offer_price') * Decimal(0.90),
                    students=Count('user',distinct=True)
                )
                .order_by('month')
            )
            # Calculate admin and teacher shares
            teacher_share = total_revenue 

            monthly_revenue_students = [
                {
                    'month': entry['month'].strftime('%b') if entry['month'] else 'Unknown',  # Convert to "Jan", "Feb", etc.
                    'revenue': entry['revenue'] or 0,
                    'students': entry['students'] or 0
                }
                for entry in monthly_data
            ]


            latest_orders = (
                Order_items.objects
                .filter(course__teacher=profile)
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

            # print({
            #     'total_revenue': total_revenue,
            #     'last_week_revenue': last_week_revenue,
            #     'today_revenue': today_revenue,
            #     'teacher_share': teacher_share,
            #     'this_month' : this_month_revenue,
            #     'monthly_revenue_students': monthly_revenue_students,
            #     'top_courses':top_courses_data,
            #     'latest_orders':latest_orders_data,
            # })

            return Response({
                'total_revenue': total_revenue,
                'last_week_revenue': last_week_revenue,
                'today_revenue': today_revenue,
                'teacher_share': teacher_share,
                'this_month' : this_month_revenue,
                'monthly_revenue_students': monthly_revenue_students,
                'top_courses':top_courses_data,
                'latest_orders':latest_orders_data,
            }, status=status.HTTP_200_OK)

    except Exception as e:
        print(e)
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from django.db.models import Count, F, ExpressionWrapper, DecimalField,Value
from django.db.models.functions import Coalesce
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def tutorTransactions(request):
    user = request.user
   
    teacher = get_object_or_404(TeacherProfile, user = user)
   # Fetch all courses for the teacher
    courses = Courses.objects.filter(teacher=teacher).annotate(
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
        


