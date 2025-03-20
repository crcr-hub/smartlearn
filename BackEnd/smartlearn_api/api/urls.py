from api import views
from django.urls import path,include
from .views import CustomTokenObtainPairView, RegisterView, LogoutView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)



urlpatterns = [

    path('', views.getRoutes,name='Routes'),
    
    path('token/', CustomTokenObtainPairView.as_view(), name='token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(),name='register'),
    path('list_students', views.list_students,name="list_students"),
    path('list_teachers', views.list_teachers,name="list_teachers" ),
    path('students/<int:id>/', views.handle_student, name="student"),
    path('teacher/<int:id>/', views.handle_teacher, name="student"),
    path('logout/', LogoutView.as_view(), name="Logout"),
    path('notification/<int:id>',views.handle_notification,name="notification"),
    path('adnotification/',views.adminNotificattions,name='adnotification'),
    path('pendingcourses',views.pending_courses,name='pendingcourses'),
    path('update_approve/<int:cid>/',views.update_approve,name='update_approve'),
    path('clear_admin_notification',views.clear_admin_notification,name='clear_admin_notification'),
    path("create-order/", views.create_order, name="create-order"),
    path('admin_dashboard/',views.admin_dashboard,name='admin_dashboard'),
    path("reports/<str:report_type>/", views.reports_view, name="reports"),
    path('', include('courses.urls')),
    path('',include('teacher.urls')),
    path('', include('student.urls')),


    
]
