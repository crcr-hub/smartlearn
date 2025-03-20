from courses import views
from .views import CategoryView, CourseView,CourseByTeacherView,ModuleView
from django.urls import path

urlpatterns = [
    path('category/', CategoryView.as_view(), name="category"),
    path('categories/<int:id>/',views.handle_category,name='categories'),
    path('courses/', CourseView.as_view(),name='courses'),
    path('course/<int:id>/',views.handle_courses,name='course'),
    path('tutorcourse/<int:teacher_id>/', CourseByTeacherView.as_view(), name='courses-by-teacher'),
    path('module/<int:id>/',views.get_module,name="module"),
    path('modules/',ModuleView.as_view(),name='modules'),
    path('publishcourses/<int:cid>',views.publish_course,name='publishcourse'),
    path('average_rating/<int:cid>',views.avarage_rating,name='average_rating')
  
    
]