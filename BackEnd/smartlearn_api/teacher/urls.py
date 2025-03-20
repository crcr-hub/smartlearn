from django.urls import path
from teacher import views
from student.views import recent_messages


urlpatterns = [
    path('all_teachers/', views.list_allteachers, name="all_teachers"),
    path('teacher_profile/<int:id>/',views.teacher_profile,name="teacher_profile"),
    path('get_students/',views.get_tutors_student,name='get_students'),
    path('t_profile/',views.get_profile,name='t_profile'),
    path('recent_tmessages/',recent_messages,name='recent_tmessages'),
    path('tutor_dashboard/',views.tutor_dashboard,name='tutor_dashboard'),
]