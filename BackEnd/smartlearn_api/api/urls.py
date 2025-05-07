from api import views
from django.urls import path,include
from .views import (CustomTokenObtainPairView, RegisterView, LogoutView,SendOTPView,
                    VerifyOTPView,ResetPasswordView,PendingCoursesView,ApproveCourseView,
                    StatusCourseView,UserDetailsView,ClearAdminNotificationView,AdminNotificationsView,
                    AdminDashboardView,AdminTransactions,SingleStudentTransaction
                    )
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)



urlpatterns = [

    path('', views.getRoutes,name='Routes'),
    path('test-time/', views.test_time),
    path('token/', CustomTokenObtainPairView.as_view(), name='token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user-details/', UserDetailsView.as_view(), name='user-details'),
    path('register/', RegisterView.as_view(),name='register'),
    path('list_students', views.list_students,name="list_students"),
    path('list_teachers', views.list_teachers,name="list_teachers" ),
    path('students/<int:id>/', views.handle_student, name="student"),
    path('teacher/<int:id>/', views.handle_teacher, name="student"),
    path('logout/', LogoutView.as_view(), name="Logout"),
    path('notification/<int:id>',views.handle_notification,name="notification"),
    path('adnotification/',AdminNotificationsView.as_view(),name='adnotification'),
    path('pendingcourses',PendingCoursesView.as_view(),name='pendingcourses'),
    path('update_approve/<int:cid>/',ApproveCourseView.as_view(),name='update_approve'),
    path('update_status/<int:cid>/',StatusCourseView.as_view(),name='update_status'),
    path('clear_admin_notification',ClearAdminNotificationView.as_view(),name='clear_admin_notification'),
    path("create-order/", views.create_order, name="create-order"),
    path('admin_dashboard/',AdminDashboardView.as_view(),name='admin_dashboard'),
    path("reports/<str:report_type>/", views.reports_view, name="reports"),
    path('teachertransaction/<int:tid>/',views.tutorTransaction,name='teachertransaction'),
    path('student_transaction/<int:sid>/',SingleStudentTransaction.as_view(),name='student_transaction'),
    path('transactions/',AdminTransactions.as_view(),name='transactions'),
    path('sentOtp/',SendOTPView.as_view(),name='sendOtp'),
    path('verifyOtp/',VerifyOTPView.as_view(),name='verifyOtp'),
    path('resetPwd/',ResetPasswordView.as_view(),name='resetPwd'),
    path('', include('courses.urls')),
    path('',include('teacher.urls')),
    path('', include('student.urls')),


    
]
