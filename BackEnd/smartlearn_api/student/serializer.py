from rest_framework import serializers
from .models import StudentProfile,Cart,Wishlist,Order,Order_items,EnrolledCourses,Progress,Comments
from courses.models import Courses,Modules
from api.models import User

class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ['id','first_name', 'last_name','place','gender','place','mobile','qualification']

class CartSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset = User.objects.all())
    course = serializers.PrimaryKeyRelatedField(queryset = Courses.objects.all() )
    class Meta:
        model = Cart
        fields = ['id','user','course','date']
class WishlistSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset = User.objects.all())
    course = serializers.PrimaryKeyRelatedField(queryset = Courses.objects.all() )
    class Meta:
        model = Wishlist
        fields = ['id','user','course','date']

class OrderSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset = User.objects.all())
    class Meta:
        model = Order
        fields = ['id','user','user_housename','user_city','user_pincode','date','total_price']

class OrderItemsSerializer(serializers.ModelSerializer):
    order = serializers.PrimaryKeyRelatedField(queryset = Order.objects.all())
    course = serializers.PrimaryKeyRelatedField(queryset = Courses.objects.all())
    class Meta:
        model = Order_items
        fields = ['id','order','course','price','offer_price']
        
class OrderPlacementSerializer(serializers.ModelSerializer):
    housename = serializers.CharField(max_length=500)
    city = serializers.CharField(max_length=500)
    pincode = serializers.IntegerField()

    def validate_pincode(self, value):
        if len(str(value)) != 6:  # Ensure the pincode has exactly 6 digits
            raise serializers.ValidationError("Pincode must be 6 digits long.")
        return value

class EnrolledCourseSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset = User.objects.all())
    course = serializers.PrimaryKeyRelatedField(queryset = Courses.objects.all())
    class Meta:
        model = EnrolledCourses
        fields = ['id','user','course','starting_date','ended_date','is_completed','progress']

class CommentSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='profile.first_name', read_only=True)
    profile = serializers.PrimaryKeyRelatedField(queryset=StudentProfile.objects.all())
    module = serializers.PrimaryKeyRelatedField(queryset=Modules.objects.all())
    replies = serializers.SerializerMethodField()
    replying_to = serializers.SerializerMethodField()

    class Meta:
        model = Comments
        fields = ['id','first_name', 'profile', 'module', 'parent', 'comment', 'replies', 'replying_to', 'created_at', 'update_at']

    def get_replies(self, obj):
        replies = obj.replies.order_by('created_at')
        return CommentSerializer(replies, many=True).data

    def get_replying_to(self, obj):
        if obj.parent:
            return {
                "profile_id": obj.parent.profile.id,
                "name": obj.parent.profile.first_name  # Assuming profile has `first_name`
            }
        return None
