from student import views
from django.urls import path
urlpatterns = [
    path('add_cart/', views.add_cart, name="category"),
    path('fetch_cart/<int:id>',views.fetch_cart,name="fetch_cart"),
    path('profile/',views.handle_profile,name='profile'),
    path('cartcourses/', views.get_courses, name='cartcourses'),
    path('add_wishlist/',views.add_wishlist,name="addwishlist"),
    path('fetch_wishlist/<int:id>',views.fetch_wishlist,name="fech_wishlist"),
    path('place_order/',views.place_order,name='place_order'),
    path('fetch_learnings/',views.fetchLearnings,name='fetch_learnings'),
    path('fetchmycourse/<int:id>',views.fetchMyCourse,name='fetchmycourse'),
    path('comment/',views.comment,name='comment'),
    path('get_tutor/',views.get_user_tutors,name='get_tutor'),
    path('recent_messages/',views.recent_messages,name='recent_messages'),
    path('handle_comment/<int:cid>',views.handle_comment,name='handle_comment'),
    path('changeIsRead/<int:room_id>', views.changeIsRead, name="changeIsRead"),
    path('handleProgress/<int:mid>',views.handleProgress,name='handleProgress'),
    path('fetchProgress/<int:cid>',views.fetchProgress,name='fetchProgress'),
    path('handleFeedback/<int:cid>',views.handleFeedback,name='handleFeedback'),
    path('all_feedback/<int:cid>',views.all_feedback,name='all_feedback'),
    path("upload-image/", views.upload_image, name="upload-image"),
    path('uprofile/<int:pid>',views.update_profile,name='uprofile'),
    
    
    ]