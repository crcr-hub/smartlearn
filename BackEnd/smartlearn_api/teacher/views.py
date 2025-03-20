from django.shortcuts import get_object_or_404, render
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializer import TeacherProfileSerializer
from .models import TeacherProfile
from courses.models import Courses
from student.models import EnrolledCourses, Order_items,StudentProfile
from student.serializer import StudentProfileSerializer
from api.models import AdminNotification
# Create your views here.
@api_view(['GET'])
def list_allteachers(request):
    try:
        teacher = TeacherProfile.objects.all()
        if not teacher.exists():
            return Response({"message": "No teachers found."}, status=status.HTTP_404_NOT_FOUND)

        combined_data = TeacherProfileSerializer(teacher, many=True)
        return Response(combined_data.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def teacher_profile(request,id):
    try:
        teacher = TeacherProfile.objects.get(id=id)  # Fetch a single teacher
        teacher_data = TeacherProfileSerializer(teacher)
        return Response(teacher_data.data, status=status.HTTP_200_OK)
       
       
    except TeacherProfile.DoesNotExist:
        return Response({"message": "No teacher found."}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from django.contrib.auth import get_user_model

User = get_user_model()

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

    # students_data = []
    # for enrollment in enrolled_students:
    #     student_profile = StudentProfile.objects.filter(user=enrollment.user).first()
    #     if student_profile:
    #         students_data.append({
    #             "student_id": student_profile.id,
    #             "first_name": student_profile.first_name,
    #             "last_name": student_profile.last_name,
    #             "course_id": enrollment.course.id,
    #             "course_name": enrollment.course.name  # Assuming course has a 'name' field
    #         })
        
    # students = StudentProfile.objects.filter(
    #     user__role='student',  # Ensuring we only get students
    #     user__enrolledcourses__course__teacher=teacher_profile
    # ).distinct()

    # serializer = StudentProfileSerializer(students, many=True)
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



# @api_view(['POST'])
# def sentNotification(request,cid):
#     try:
#         course = get_object_or_404(Courses, id=cid)  # Get the course instance
        
#         # Create an admin notification
#         notification = AdminNotification.objects.create(
#             sender=request.user,  # Tutor sending the request
#             course=course,  # Store course object instead of just ID
#             message=f"New course '{course.title}' submitted for approval."
#         )
        
#         return Response({"message": "Notification sent successfully", "notification_id": notification.id}, status=201)

#     except Exception as e:
#         return Response({"error": str(e)}, status=400)