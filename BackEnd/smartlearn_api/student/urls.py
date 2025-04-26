from student import views
from django.urls import path
from .views import (ChangePasswordView,GetUserTutors,AddToCartView,FetchCartView,GetCoursesView,WishlistView,AddWishlistView,
                    HandleStudentProfileView
                    )
urlpatterns = [
    path('add_cart/', AddToCartView.as_view(), name="category"),
    path('fetch_cart/<int:id>',FetchCartView.as_view(),name="fetch_cart"),
    path('profile/',HandleStudentProfileView.as_view(),name='profile'),
    path('cartcourses/', GetCoursesView.as_view(), name='cartcourses'),
    path('add_wishlist/',AddWishlistView.as_view(),name="addwishlist"),
    path('fetch_wishlist/<int:id>',WishlistView.as_view(),name="fech_wishlist"),
    path('place_order/',views.place_order,name='place_order'),
    path('fetch_learnings/',views.fetchLearnings,name='fetch_learnings'),
    path('fetchmycourse/<int:id>',views.fetchMyCourse,name='fetchmycourse'),
    path('comment/',views.comment,name='comment'),
    path('get_tutor/',GetUserTutors.as_view(),name='get_tutor'),
    path('recent_messages/',views.recent_messages,name='recent_messages'),
    path('handle_comment/<int:cid>',views.handle_comment,name='handle_comment'),
    path('changeIsRead/<int:room_id>', views.changeIsRead, name="changeIsRead"),
    path('handleProgress/<int:mid>',views.handleProgress,name='handleProgress'),
    path('fetchProgress/<int:cid>',views.fetchProgress,name='fetchProgress'),
    path('handleFeedback/<int:cid>',views.handleFeedback,name='handleFeedback'),
    path('all_feedback/<int:cid>',views.all_feedback,name='all_feedback'),
    path("upload-image/", views.upload_image, name="upload-image"),
    path('uprofile/<int:pid>',views.update_profile,name='uprofile'),
    path('changepwd/',ChangePasswordView.as_view(),name='changepwd'),
    
    
    ]