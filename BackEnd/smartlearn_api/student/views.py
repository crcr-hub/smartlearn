from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny,IsAuthenticated
from api.models import StudentProfile
from api.serializer import UserSerializer
from courses.models import CourseStatus, Courses,Modules, RatingStar, Status
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
from rest_framework.views import APIView
from django.contrib.auth.hashers import check_password, make_password

# Create your views here.



class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        print(user,current_password)

        if not current_password or not new_password:
            return Response({'error': 'Both current and new passwords are required'}, status=status.HTTP_400_BAD_REQUEST)

        if not check_password(current_password, user.password):
            return Response({'error': 'Incorrect current password'}, status=status.HTTP_400_BAD_REQUEST)

        user.password = make_password(new_password)
        user.save()

        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)



class HandleStudentProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            profile = StudentProfile.objects.get(user=user)
            serializer = StudentProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except StudentProfile.DoesNotExist:
            return Response({'error': 'Student profile not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AddWishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            course_id = request.data.get("courseId")
            if not course_id:
                return Response({'error': 'Course ID is required'}, status=status.HTTP_400_BAD_REQUEST)

            course = Courses.objects.get(id=course_id)

            wishlist, created = Wishlist.objects.get_or_create(user=user, course=course)
            if created:
                return Response({'message': 'Course added to wishlist successfully'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'message': 'Course already exists in the wishlist'}, status=status.HTTP_200_OK)

        except Courses.DoesNotExist:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class WishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            wishlist = Wishlist.objects.filter(user=user).select_related('course')
            list_course = []
            for items in wishlist:
                latest_status = Status.objects.filter(course = items.course).order_by('-id').first()
                is_enrolled = EnrolledCourses.objects.filter(user=user,course=items.course).exists()
                in_cart = Cart.objects.filter(user=user,course=items.course).exists()
                star_ratings = RatingStar.objects.filter(course = items.course)
                if latest_status:
                     course_status_value = latest_status.course_status
                else:
                    course_status_value = 'public'
                
                if star_ratings.exists():
                    average = sum([rating.star for rating in star_ratings]) / star_ratings.count()
                    average_rating = round(average, 1)
                else:
                    average_rating = None
                if items.course.teacher.user.block_status:
                    teacher_name = 'Unavilable'
                else:
                    teacher_name = f"{items.course.teacher.first_name} {items.course.teacher.last_name}"

                list_course.append({
                    'id':items.course.id,
                    'wid':items.id,
                    "course_name":items.course.name,
                    'image':items.course.images.url,
                    'by':teacher_name,
                    'rating':average_rating,
                    'price':items.course.price,
                    'offer_price':items.course.offer_price,
                    'in_cart':in_cart,
                    'is_enrolled':is_enrolled,
                    'status':course_status_value
                })
            if not wishlist.exists():
                list_course = []
                return Response(list_course, status=status.HTTP_200_OK)
            return Response(list_course, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request):
        try:
            wishlist_item_id = request.data.get('wishlist_item_id')
            if not wishlist_item_id:
                return Response({"error": "Wishlist item ID is required"}, status=status.HTTP_400_BAD_REQUEST)

            wishlist_item = get_object_or_404(Wishlist, id=wishlist_item_id)
            wishlist_item.delete()

            return Response( status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            course_id = request.data.get("courseId")

            if not course_id:
                return Response({'error': 'Course ID is required'}, status=status.HTTP_400_BAD_REQUEST)

            # Check if the course is already purchased
            if Order_items.objects.filter(order__user=user, course_id=course_id).exists():
                return Response({'message': 'You have already purchased this course.'}, status=status.HTTP_200_OK)

            # Check if course exists
            try:
                course = Courses.objects.get(id=course_id)
            except Courses.DoesNotExist:
                return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

            # Add to cart
            cart, created = Cart.objects.get_or_create(user=user, course=course)
            if created:
                return Response({'message': 'Course added to cart successfully'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'message': 'Course already exists in the cart'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





class FetchCartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            cart = Cart.objects.filter(user=user).select_related('course')
            if not cart.exists():            
                return Response({
                    "cart_data": [],
                    "total_price": 0,
                    "offer_total": 0,
                    "discount": 0
                }, status=status.HTTP_200_OK)
            
            cart_data = []
            total_price = 0
            total_offer_price = 0
            for items in cart:
                latest_status = Status.objects.filter(course=items.course).order_by('-id').first()
                if latest_status:
                    course_status_value = latest_status.course_status
                else:
                    course_status_value = 'public'
                in_wishlist = Wishlist.objects.filter(user=user,course=items.course).exists()
                star_ratings = RatingStar.objects.filter(course = items.course)
                if star_ratings.exists():
                    average = sum([rating.star for rating in star_ratings]) / star_ratings.count()
                    average_rating = round(average, 1)
                else:
                    average_rating = None
                if items.course.teacher.user.block_status:
                    teacher_name = 'Unavailable'
                else:
                    teacher_name = f"{items.course.teacher.first_name} {items.course.teacher.last_name}"
                cart_data.append({
                    'id':items.course.id,
                    'cid':items.id,
                    "course_name":items.course.name,
                    'image':items.course.images.url,
                    'by':teacher_name,
                    'rating':average_rating,
                    'price':items.course.price,
                    'offer_price':items.course.offer_price,
                    'in_wishlist':in_wishlist,
                    'status':course_status_value,
                })
                if course_status_value.lower() == 'public':
                    total_price += items.course.price
                    total_offer_price += items.course.offer_price
            
            serializer = CartSerializer(cart, many=True)
            # total_price = sum(item.course.price for item in cart if Status.objects.filter(course=item.course)).order_by('-date').first() == 'Public' or 'public'
           
                
            discount = abs(total_price - total_offer_price)
           
            return Response({
                "cart_data":cart_data,
                "total_price": total_price,
                "offer_total": total_offer_price,
                "discount": discount
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request):
        
        try:
            user = request.user
            cart_item_id = request.data.get('cart_item_id')
            if not cart_item_id:
                return Response({"error": "Cart item ID is required"}, status=status.HTTP_400_BAD_REQUEST)

            cart_item = get_object_or_404(Cart,user=user, id=cart_item_id)
            cart_item.delete()



            return Response(status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





class GetCoursesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        cart_items = Cart.objects.filter(user = user)
        if not cart_items:
            return Response({"error": "No courses in cart"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            course_ids = [item.course.id for item in cart_items if item.course]
        except ValueError:
            return Response({"error": "Invalid course ID format."}, status=status.HTTP_400_BAD_REQUEST)
        cart_courses = []
        courses = Courses.objects.filter(id__in=course_ids)
        for items in courses:
            
            if items.teacher.user.block_status:
                teacher_name = 'Unavailable'
            else:
                teacher_name = f"{items.teacher.first_name} {items.teacher.last_name}"
            

            cart_courses.append({
                'id':items.id,
                'course_name':items.name,
                'teacher_name':teacher_name,
                'images':items.images.url,
                 'offer_price':items.offer_price,
                 'price':items.price,
                
                
            })
        serializer = CourseSerializer(courses, many=True)
        return Response(cart_courses, status=status.HTTP_200_OK)

import razorpay
from django.conf import settings



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_razorpay_order(request):
    user = request.user

    cart_items = Cart.objects.filter(user=user)
    if not cart_items.exists():
        return Response({'error': 'Your cart is empty!'}, status=400)

    total_price = sum(item.course.offer_price for item in cart_items)
    amount = int(total_price * 100)  # Convert to paisa

    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
    
    data = {
        "amount": amount,
        "currency": "INR",
        "payment_capture": 1,
    }

    try:
        order = client.order.create(data=data)
        return Response(order)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_order(request):
    user = request.user
    cart_items = Cart.objects.filter(user=user).select_related('course')
    
    if not cart_items.exists():
        return Response({'error': 'Your cart is empty!'}, status=400)
    for items in cart_items:
        latest_status = Status.objects.filter(course=items.course).order_by('-id').first()
        course_status_value = latest_status.course_status if latest_status else 'public'
        if course_status_value.lower() != 'public':
            return Response({
                'error': f"Course '{items.course.name}' is not available for purchase. Please remove it from your cart."
            }, status=400)

       
    try:
         # Razorpay verification
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

        # Only verify if payment method is razorpay
        if request.data['payment'] == 'razorpay':
            params_dict = {
                'razorpay_order_id': request.data['order_id'],
                'razorpay_payment_id': request.data['payment_id'],
                'razorpay_signature': request.data['signature'],
            }

            try:
                client.utility.verify_payment_signature(params_dict)
            except razorpay.errors.SignatureVerificationError:
                return Response({'error': 'Payment verification failed!'}, status=400)

        total_price = sum(item.course.offer_price for item in cart_items)
        with transaction.atomic():
            order = Order.objects.create(
                user=user,
                user_housename=request.data['user_housename'],
                user_city=request.data['user_city'],
                user_pincode=request.data['user_pincode'],
                user_state = request.data['user_state'],
                total_price=total_price,
                payment_type = request.data['payment'],
                payment_id = request.data['payment_id']
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


class FetchLearnings(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        learning_courses =  EnrolledCourses.objects.filter(user=user).select_related('course')
        courses = []
        for items in learning_courses:
            star_ratings = RatingStar.objects.filter(course = items.course)
            if star_ratings.exists():
                average = sum([rating.star for rating in star_ratings]) / star_ratings.count()
                average_rating = round(average, 1)
            else:
                average_rating = None
            courses.append({
                "course_id":items.course.id,
                "course_name":items.course.name,
                "by":items.course.teacher.first_name + " "+items.course.teacher.last_name,
                "rating":average_rating,
                "image":items.course.images.url if items.course.images else None,
            })
        
        return Response({"courses":courses},status=status.HTTP_200_OK)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetchMyCourse(request,cid):
    user = request.user
    try:
        # Ensure the user is enrolled in the course
        enrolled_course = EnrolledCourses.objects.get(user=user, course=cid)
        course = Courses.objects.get(id=cid)
        course_serializer = CourseSerializer(course)

        modules = Modules.objects.filter(course=cid)
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
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
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

class GetUserTutors(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        enrolled_courses = EnrolledCourses.objects.filter(user = request.user).select_related('course__teacher')
        tutors_dict = {}
        for course in enrolled_courses:
            teacher = course.course.teacher
            user = teacher.user

            if teacher.id not in tutors_dict:
                tutors_dict[teacher.id] = {
                    "tutor": {
                        "id": teacher.id,
                        "name": f"{teacher.first_name} {teacher.last_name}",
                        "email": user.email,
                        "block_status": user.block_status,
                    },
                    "courses": [course.course.name]
                }
            else:
                tutors_dict[teacher.id]["courses"].append(course.course.name)

        return Response(list(tutors_dict.values()), status=status.HTTP_200_OK)
    



@api_view(['POST'])
def changeIsRead(request,room_id):
    Message.objects.filter(room_id=room_id, is_read=False).update(is_read=True)
    return Response({"message": "Successfully changed"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
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
        tutor = TeacherProfile.objects.select_related('user').filter(user__id=user_id).first()

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
                "block_status": tutor.user.block_status
                
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
@permission_classes([IsAuthenticated])
def update_profile(request,pid):
    if request.method == 'PUT':
        user = request.user
        try:
            profile_data = StudentProfile.objects.get(user = user)
        except StudentProfile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = StudentProfileSerializer(profile_data,data = request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from decimal import Decimal

class SingleTransaction(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,cid):
            try:
                course = Courses.objects.get(id=cid)
            except Courses.DoesNotExist:
                return Response({'error': 'Course not found'}, status=404)
            
            course_order = Order_items.objects.filter(course=course).select_related('order')
            orders_data = []
            grand_total_price = Decimal(0)
            grand_teacher_share = Decimal(0)
            grand_admin_share = Decimal(0)
            for items in course_order:
                
                order = items.order
                student_profile = getattr(order.user,'studentprofile',None)
                orders_data.append({
                'order_id': order.id,
                'student_name':student_profile.first_name + " " + student_profile.last_name,
                'date1': order.date.strftime('%Y-%m-%d   %H:%M:%S'),
                'total_price': order.total_price,
                'payment_type': order.payment_type,
                'payment_id': order.payment_id,
                'offer_price': items.Offer_price,
                'tutor_share':items.Offer_price * Decimal(0.90),
                'admin_share': items.Offer_price * Decimal(0.10) ,
                'original_price': items.price,
                'ordered_at': items.created_at,})
                grand_total_price += items.Offer_price
                grand_teacher_share += items.Offer_price * Decimal(0.90)
                grand_admin_share += items.Offer_price * Decimal(0.10)

            return Response({
                'orders': orders_data,
                'grand_total': grand_total_price,
                'grand_tutor': grand_teacher_share,
                'grand_admin': grand_admin_share
            })



class OrderHIstory(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        orders = Order.objects.filter(user= user).prefetch_related('my_order_items')
        order_data = []
        for items in orders:
            courses = []
            for orderitems in items.my_order_items.all():
                courses.append({
                    'course':orderitems.course.name,
                })

            order_data.append({
                'oid':items.id,
                'date':items.date,
                'housename':items.user_housename,
                'city':items.user_city,
                'pincode':items.user_pincode,
                'courses':courses,
                'total':items.total_price,
                'type':items.payment_type,
            })
        print("order data",order_data)
        return Response(order_data,status=status.HTTP_200_OK)


from rest_framework.exceptions import NotFound
class Reciept(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,oid):
        user = request.user
        try:
            order = Order.objects.get(id=oid, user=user)
        except Order.DoesNotExist:
            return Response({'error': 'Invalid request.'}, status=status.HTTP_404_NOT_FOUND)
        orderitems = Order_items.objects.filter(order = order)
        orderdata = []
        grandTotal = 0
       
        address ={
            'housename':order.user_housename,
            'city':order.user_city,
            'state':order.user_state,
            'pincode':order.user_pincode
        }
        for items in orderitems:
                orderdata.append({
                    'course':items.course.name,
                    'price':items.price,
                    'offer_price':items.Offer_price,
                    'item': 1,
                    'date':items.order.date,
                    'payment_id':items.order.payment_id,
                    'type':items.order.payment_type,
                })
                grandTotal += items.Offer_price
        return Response({'data':orderdata,'total':grandTotal,'address':address},status=status.HTTP_200_OK)
       