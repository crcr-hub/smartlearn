# from django.db.models.signals import post_save
# from django.dispatch import receiver

# from django.apps import apps
# User = apps.get_model('api.User')
# StudentProfile = apps.get_model('student.StudentProfile')
# TeacherProfile = apps.get_model('teacher.TeacherProfile')

# @receiver(post_save, sender=User)
# def create_profile(sender, instance, created, **kwargs):
#     if created:
#             # Here, we check if a StudentProfile already exists for the user
#         if not hasattr(instance, 'studentprofile'):
#                 # If the StudentProfile doesn't exist, create it
#             profile = StudentProfile.objects.create(
#                     user=instance,
#                     first_name=instance.first_name,
#                     last_name=instance.last_name,
#                     gender=instance.studentprofile.gender if hasattr(instance, 'studentprofile') else 'Male',  # Default gender
#                     place=instance.studentprofile.place if hasattr(instance, 'studentprofile') else '',
#                     qualification=instance.studentprofile.qualification if hasattr(instance, 'studentprofile') else 'Not Provided',
#                     mobile=instance.studentprofile.mobile if hasattr(instance, 'studentprofile') else '',
#                 )
#             print(f"Student profile created for: {instance.first_name} {instance.last_name}")
        
#         elif instance.role == 'teacher':
#             TeacherProfile.objects.create(user=instance)

# @receiver(post_save, sender=User)
# def save_user_profile(sender, instance, **kwargs):
#     if hasattr(instance, 'student_profile'):
#         instance.student_profile.save()
#     if hasattr(instance, 'teacher_profile'):
#         instance.teacher_profile.save()


