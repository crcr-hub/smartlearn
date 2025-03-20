from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny,IsAuthenticated
from api.models import StudentProfile
from api.serializer import UserSerializer
from courses.models import Courses,Modules, RatingStar
from courses.serializer import CourseSerializer, ModuleSerializer, RatingSerializer
from .serializer import( EnrolledCourseSerializer
,StudentProfileSerializer,OrderSerializer,OrderItemsSerializer,
CartSerializer,WishlistSerializer,OrderPlacementSerializer,
CommentSerializer)
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from teacher.models import TeacherProfile
from .models import Cart,Wishlist,Order_items,Order,EnrolledCourses,Progress,Comments,Message,Progress
from django.shortcuts import get_object_or_404
from django.db import transaction
from collections import defaultdict
from django.db.models import Max ,Q

# Create your views here.

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def handle_profile(request):
    try:
        if request.method == 'GET':
            user = request.user
            profile = StudentProfile.objects.get(user=user)
            serializer =StudentProfileSerializer(profile)
            return Response(serializer.data, status=200)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def add_wishlist(request):
    try:
   
        user = request.user
        course_id = request.data.get("courseId")
        if not course_id:
            return Response({'error': 'Course ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Retrieve the course instance
        course = Courses.objects.get(id=course_id)
        
        # Create a new cart entry
        wishlist, created = Wishlist.objects.get_or_create(user=user, course=course)
        
        if created:
            return Response({'message': 'Course added to wishlist successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Course already exists in the wishlist'}, status=status.HTTP_200_OK)
    
    except Wishlist.DoesNotExist:
        return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except:
        return Response({'error': ' not found'}, status=status.HTTP_404_NOT_FOUND)




@api_view(['GET','DELETE'])
@permission_classes([IsAuthenticated])
def fetch_wishlist(request,id):
    try:
        if request.method == 'GET':
            wishlist = Wishlist.objects.filter(user_id=id).select_related('course')
            if not wishlist.exists():
                return Response({"message": "No wishlist items found for this user."}, status=404)

            serializer =WishlistSerializer(wishlist, many=True)
            return Response(serializer.data, status=200)
        elif request.method == 'DELETE':
            wishlist_item_id = request.data.get('wishlist_item_id')
            if not wishlist_item_id:
                return Response({"error": "Cart item ID is required"}, status=400)

            # Get and delete the specific cart item
            wishlist_item = get_object_or_404(Wishlist, id=wishlist_item_id)
            wishlist_item.delete()

            # Fetch the updated cart after deletion
            updated_wishlist = Wishlist.objects.filter(user_id=id).select_related('course')
            serializer = WishlistSerializer(updated_wishlist, many=True)

            # Recalculate total price and offer price
            return Response(serializer.data, status=200)

    except Exception as e:
        print("Error:", str(e))
        return Response({"error": str(e)}, status=500)





@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def add_cart(request): 
    try:
        user = request.user
        course_id = request.data.get("courseId")
        if not course_id:
            return Response({'error': 'Course ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if Order_items.objects.filter(order__user=user, course_id=course_id).exists():
            return Response({'message': 'You have already purchased this course.'}, status=status.HTTP_200_OK)

        
        # Retrieve the course instance
        course = Courses.objects.get(id=course_id)
        
        # Create a new cart entry
        cart, created = Cart.objects.get_or_create(user=user, course=course)
        if created:
            return Response({'message': 'Course added to cart successfully'}, status=status.HTTP_201_CREATED)
        
        else:
            return Response({'message': 'Course already exists in the cart'}, status=status.HTTP_200_OK)
    except Courses.DoesNotExist:
        print("Unexpected error:", str(e))
        return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print("Unexpected error:", str(e))
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except:
        print("Unexpected error:", str(e))
        return Response({'error': ' not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET','DELETE'])
@permission_classes([IsAuthenticated])
def fetch_cart(request,id):
    try:
        if request.method == 'GET':
            cart = Cart.objects.filter(user_id=id).select_related('course')
            if not cart.exists():
                return Response({"message": "No cart items found for this user."}, status=404)
            else:
                serializer =CartSerializer(cart, many=True)
                total_price = sum(items.course.price for items in cart) 
                total_offer_price = sum(items.course.offer_price for items in cart)
                discount = abs(total_price - total_offer_price)
                return Response({
                    "cart": serializer.data,
                    "total_price": total_price,
                    "offer_total":total_offer_price,
                    "discount" :discount
                })
        elif request.method == 'DELETE':
            cart_item_id = request.data.get('cart_item_id')
            if not cart_item_id:
                return Response({"error": "Cart item ID is required"}, status=400)

            # Get and delete the specific cart item
            cart_item = get_object_or_404(Cart, id=cart_item_id)
            cart_item.delete()

            # Fetch the updated cart after deletion
            updated_cart = Cart.objects.filter(user_id=id).select_related('course')
            serializer = CartSerializer(updated_cart, many=True)

            # Recalculate total price and offer price
            total_price = sum(items.course.price for items in updated_cart)
            total_offer_price = sum(items.course.offer_price for items in updated_cart)
            discount = abs(total_price - total_offer_price)

            return Response({
                "cart": serializer.data,
                "total_price": total_price,
                "offer_total": total_offer_price,
                "discount" :discount  })
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_courses(request):
    course_ids = request.GET.get('ids', None)
    if not course_ids:
        return Response({"error": "No course IDs provided."}, status=400)
    try:
        course_ids = [int(course_id) for course_id in course_ids.split(",")]
    except ValueError:
        return Response({"error": "Invalid course ID format."}, status=400)
    courses = Courses.objects.filter(id__in=course_ids)
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_order(request):
    user = request.user
    cart_items = Cart.objects.filter(user=user)
    print("request data",request.data)
    if not cart_items.exists():
        return Response({'error': 'Your cart is empty!'}, status=400)
    try:
        with transaction.atomic():
            order = Order.objects.create(
                user=user,
                user_housename=request.data['user_housename'],
                user_city=request.data['user_city'],
                user_pincode=request.data['user_pincode'],
                total_price=request.data['total_price'],
                payment_type = request.data['payment'],
            )
            order_items_list = []  # Store created order items
            enrolled_courses_dict = {} 

            for cart_item in cart_items:
                order_item = Order_items.objects.create(
                    order=order,
                    course=cart_item.course,
                    price=cart_item.course.price,
                    Offer_price=cart_item.course.offer_price
                )
                order_items_list.append(order_item)
                if cart_item.course not in enrolled_courses_dict:
                    enrolled_course = EnrolledCourses.objects.create(
                        user=user,
                        course=cart_item.course,  
                    )
                    enrolled_courses_dict[cart_item.course] = enrolled_course

            for course, enrolled_course in enrolled_courses_dict.items():
                enrolled_course.order.set(order_items_list)  # Correct way to assign ManyToManyField

            cart_items.delete()
        response_serializer = OrderSerializer(order)
        return Response(response_serializer.data, status=201)

    except Exception as e:
        print("Unexpected error:", str(e))
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetchLearnings(request):
    user = request.user
    learnings = EnrolledCourses.objects.filter(user=user)
    if not learnings.exists():
        return Response({'error': 'You are not enrolled any courses!'}, status=400)
    serializer = EnrolledCourseSerializer(learnings,many=True)
    print("learningdata",serializer.data)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetchMyCourse(request,id):
    user = request.user
    try:
        # Ensure the user is enrolled in the course
        enrolled_course = EnrolledCourses.objects.get(user=user, course=id)
        course = Courses.objects.get(id=id)
        course_serializer = CourseSerializer(course)

        modules = Modules.objects.filter(course=id)
        module_serializer = ModuleSerializer(modules, many=True)
        first_module_video_url = None
        if modules.exists():
            first_module = modules.first()  # Fetch the first module
            first_module_video_url = getattr(first_module, 'media', None)  # Get the video_url attribute
        return Response({
            "course": course_serializer.data,  # All course details
            "modules": module_serializer.data,  # List of modules
            "video_url": first_module_video_url,  # First module's video URL
        }, status=200)
    except EnrolledCourses.DoesNotExist:
        return Response({'error': 'You are not enrolled in this course'}, status=403)
    except Modules.DoesNotExist:
        return Response({'error': 'Modules not found for this course'}, status=404)
    
# ........................comments........................

@api_view(['POST','GET','DELETE'])
def comment(request):
    if request.method == 'POST':
        moduleId = request.data.get('moduleId')
        module = get_object_or_404(Modules, id=moduleId)
        comment_text = request.data.get('comment_text')
        parent_id = request.data.get('parent_id', None)
        if not comment_text:
            return Response({"error": "Comment text is required"}, status=400)
        parent_comment = None
        if parent_id:
            try:
                parent_comment = Comments.objects.get(id=parent_id)
            except Comments.DoesNotExist:
                return Response({"error": "Parent comment not found"}, status=404)

        try:
            comment = Comments.objects.create(
                profile = request.user.studentprofile,
                module = module,
                comment = comment_text,
                parent = parent_comment
            )
        except AttributeError:
            return Response({"error":"doesnot have valid profile"}, status=400)
        serializer = CommentSerializer(comment)
        return Response({"message": "Comment or reply added successfully!"}, status=201)
    
    elif request.method == 'GET':
        moduleId = request.query_params.get('moduleId')
        comments = Comments.objects.filter(module=moduleId).order_by('created_at')
        serializer = CommentSerializer(comments, many=True)
        flat_comments = serializer.data
        # Helper function to build nested structure
        def build_comment_tree(flat_comments):
            comment_map = defaultdict(list)  # To group replies under their parents
            nested_comments = []  # Final nested structure

            # Group comments by parent_id
            for comment in flat_comments:
                parent_id = comment['parent']
                if parent_id is None:  # Root-level comment
                    nested_comments.append(comment)
                else:  # Reply, add to parent
                    comment_map[parent_id].append(comment)

            # Attach replies recursively
            def attach_replies(comment):
                comment_id = comment['id']
                if comment_id in comment_map:
                    comment['replies'] = comment_map[comment_id]
                    for reply in comment['replies']:
                        attach_replies(reply)
                else:
                    comment['replies'] = []  # No replies

            # Build the tree
            for root_comment in nested_comments:
                attach_replies(root_comment)

            return nested_comments

        # Build the nested comment tree
        nested_comments = build_comment_tree(flat_comments)
        # Return the nested structure
        return Response(nested_comments, status=200)
    
@api_view(['DELETE','PUT'])
def handle_comment(request,cid):
    comment = get_object_or_404(Comments,id=cid)
    if request.method == 'DELETE':
        comment.delete()
        return Response({"message":"Successfully deleted"},status=204)
    elif request.method == 'PUT':
        comment_text = request.data.get('comment_text')
        print(comment_text)
        if not comment_text:
            return Response({"error": "Comment text is required"}, status=400)
        comment.comment = comment_text  # Update comment text
        comment.save()
        return Response({"message": "Successfully updated"}, status=200)
    

@api_view(['GET'])
def get_user_tutors(request):
    if not request.user.is_authenticated:
        return Response({"error": "User not authenticated"}, status=403)

    # Fetch enrolled courses for the user
    enrolled_courses = EnrolledCourses.objects.filter(user=request.user).select_related('course__teacher')
    data = [
        {
            "course_name": course.course.name,
            "tutor": {
                "id": course.course.teacher.id,
                "name": course.course.teacher.first_name,
                "email": course.course.teacher.last_name,
            },
        }
        for course in enrolled_courses
    ]
    return Response(data)


@api_view(['POST'])
def changeIsRead(request,room_id):
    Message.objects.filter(room_id=room_id, is_read=False).update(is_read=True)
    return Response({"message": "Successfully changed"})

@api_view(['GET'])
def recent_messages(request):
    user = request.user
    try:
        # Get the latest timestamp for each conversation
        messages = Message.objects.filter(Q(sender=user) | Q(recipient=user)) \
            .values('sender', 'recipient') \
            .annotate(latest_time=Max('timestamp')) \
            .order_by('-latest_time')  # Sort by latest message

    except Message.DoesNotExist:
        return Response({"error": "Message not found"}, status=404)
    def get_profile(user_id):
        """ Helper function to get user profile details """
        student = StudentProfile.objects.filter(user__id=user_id).first()
        tutor = TeacherProfile.objects.filter(user__id=user_id).first()

        if student:
            return {
                "profile_id": student.id,
                "first_name": student.first_name,
                "last_name": student.last_name,
                
            }
        elif tutor:
            return {
                "profile_id": tutor.id,
                "first_name": tutor.first_name,
                "last_name": tutor.last_name,
                
            }
        return None
    recent_conversations = []
    seen_conversations = set()  # To track unique chat pairs

    for msg in messages:
        chat_pair = tuple(sorted([msg['sender'], msg['recipient']]))  # Unique chat identifier
        if chat_pair in seen_conversations:
            continue  # Skip duplicates
        
        seen_conversations.add(chat_pair)

        last_message = Message.objects.filter(
            (Q(sender=msg['sender'], recipient=msg['recipient']) | 
             Q(sender=msg['recipient'], recipient=msg['sender'])),
            timestamp=msg['latest_time']
        ).first()

        if last_message:
            sender_profile = get_profile(last_message.sender.id)
            recipient_profile = get_profile(last_message.recipient.id)
            recent_conversations.append({
                "id": last_message.id,
                "sender_id": last_message.sender.id,
                "sender_profile": sender_profile,
                "recipient_profile": recipient_profile,
                "sender_name": last_message.sender.username,
                "recipient_id": last_message.recipient.id,
                "recipient_name": last_message.recipient.username,
                "message": last_message.content,
                "time_stamp": last_message.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                "is_read":last_message.is_read,
                "room_id":last_message.room_id
            })

    print("recent messages", recent_conversations)
    return Response({"recent_messages": recent_conversations})


from django.core.files.storage import default_storage
from django.core.files.base import ContentFile


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_image(request):
    """Handles image uploads for chat messages."""
    if 'image' not in request.FILES:
        return Response({"error": "No image file provided"}, status=400)

    image = request.FILES['image']
    file_path = default_storage.save(f"chat_images/{image.name}", ContentFile(image.read()))
    
    image_url = request.build_absolute_uri(default_storage.url(file_path))
    return Response({"image_url": image_url}, status=201)


from datetime import timedelta

@api_view(['POST','GET'])
def handleProgress(request,mid):
    user = request.user
    if request.method == 'POST':
        print(request.data)
        course_id = request.data.get("course_id")
        module_id = request.data.get("moduleId")
        time_watched = request.data.get("time_watched")  # Time watched in seconds
        total_time = request.data.get('total_time')
        # Convert to integer safely
        
        time_watched = int(float(time_watched))
        if total_time is  None:
            total_time = 0
        total_time = int(total_time)
        course = get_object_or_404(Courses, id=course_id)
        
        # Get or create progress record
        progress, created = Progress.objects.get_or_create(student=user, module_id=module_id,course=course)

        if progress.time_watched is None:
            progress.time_watched = 0
        print("progress.time",progress.time_watched)
        # Only update if the new time watched is greater
        if time_watched > progress.time_watched:
            progress.time_watched = time_watched
            # If watched time reaches total length, mark as completed
        if progress.time_watched >= total_time:
            progress.is_completed = True
        progress.save()
        # Calculate overall progress
        total_modules = Modules.objects.filter(course_id=course).count()  # Get total number of modules
        completed_modules = Progress.objects.filter(student=user,course_id=course, is_completed=True).count()
        overall_progress = (completed_modules / total_modules) * 100 if total_modules > 0 else 0
        if overall_progress > 0:
            enrolled = get_object_or_404(EnrolledCourses,user=request.user,course_id=course)
            enrolled.progress = int(overall_progress)
            enrolled.save()
        print("over all",int(overall_progress))

        return Response({"ok":"ok"}, status=200)

    elif request.method == 'GET':
        progress_data = Progress.objects.filter(student=user,module_id=mid).values("module_id", "time_watched", "progress", "is_completed")
        return Response(progress_data, status=200)


@api_view(['GET'])
def fetchProgress(request,cid):
    course_id = cid
    if request.method == 'GET':
        print("user id",request.user.id)
        enrolled_course = get_object_or_404(EnrolledCourses,course_id=course_id,user_id=request.user.id)
        enrolled_course_data = EnrolledCourseSerializer(enrolled_course).data
        print("enrolled courses",enrolled_course_data)
        return Response(enrolled_course_data, status=200)
    
@api_view(['GET','POST','PUT'])
def handleFeedback(request,cid):
    course_id = cid
    if request.method == 'POST':
        print(request.data)
        star = request.data.get('star')
        feedback = request.data.get('feedback')
        user = request.user
        if not star or not feedback:
            return Response({"error": "Star rating and feedback are required"}, status=400)

        # Create and save a new rating entry
        feedback_entry = RatingStar.objects.create(
            user=user,
            course_id=course_id,
            star=star,
            feedback=feedback
        )
        return Response({"message": "Feedback submitted successfully"}, status=201)
    elif request.method == 'GET':
        feedback = RatingStar.objects.filter(course_id=course_id,user_id=request.user.id)
        feedback_data = RatingSerializer(feedback, many=True).data
        return Response(feedback_data,status=200)
    elif request.method == 'PUT':
        # feedback = RatingStar.objects.filter(course_id=course_id)
        feedback_data = request.data #RatingSerializer(feedback,many=True).data
        try:
            feedback_entry = RatingStar.objects.get(id=cid)
        except RatingStar.DoesNotExist:
            return Response({"error": "Feedback not found"}, status=404)
        print("newwwwwww",feedback_data)
        new_star = request.data.get('star', feedback_entry.star)  # Keep old value if not provided
        new_feedback = request.data.get('feedback', feedback_entry.feedback)

        # Update feedback fields
        feedback_entry.star = new_star
        feedback_entry.feedback = new_feedback
        feedback_entry.save()
        return Response(feedback_data,status=200)

@api_view(['GET'])
def all_feedback(request,cid):
    if request.method == 'GET':
        course_id = cid
        feedback = RatingStar.objects.filter(course_id=course_id)
        feedback_data = RatingSerializer(feedback,many=True).data
        return Response(feedback_data,status=200)


@api_view(['PUT'])
def update_profile(request,pid):
    if request.method == 'PUT':
        print(request.data)
        try:
            profile_data = StudentProfile.objects.get(id=pid)
        except StudentProfile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = StudentProfileSerializer(profile_data,data = request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        