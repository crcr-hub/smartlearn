from django.urls import path
from teacher import views
from student.views import recent_messages
from .views import TeacherProfileDetail,GetCourseTutor,GetTutorStudents


urlpatterns = [
    path('all_teachers/', views.list_allteachers, name="all_teachers"),
    path('teacher_profile/<int:id>/',TeacherProfileDetail.as_view(),name="teacher_profile"),
    path('get_students/<int:sid>/',GetTutorStudents.as_view(),name='get_students'),
    path('t_profile/',views.get_profile,name='t_profile'),
    path('recent_tmessages/',recent_messages,name='recent_tmessages'),
    path('tutor_dashboard/',views.tutor_dashboard,name='tutor_dashboard'),
    path('tutortransactions/',views.tutorTransactions,name='tutortransactions'),\
    path('tutor_course/',GetCourseTutor.as_view(),name='tutor_course')
]