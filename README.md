mysmartlearn

An online learning platform where students can enroll in courses, interact with teachers through live chat, track their progress, and much more. Built with Django and React, and hosted on AWS.

Features

Admin can manage users, courses, and approve tutors.

Students can register, enroll in courses, and view progress.

Teachers can manage their own courses and modules.

Add to cart and wishlist.

Real-time chat using Django Channels & WebSockets.

Secure authentication using JWT.

Course progress tracking.

Notifications and feedback system.


Receipts, transactions, and course purchase history.

Hosted on AWS with S3, EC2, and Route 53 (e.g., mysmartlearn.com).

Tech Stack
Frontend:

  React

  Redux Toolkit

  React Router

  Axios

  Backend:

  Django

Django REST Framework

SimpleJWT

Hosting       :

AWS EC2, S3, Route 53

Nginx

Gunicorn

PostgreSQL

Django Channels (WebSockets)

Celery + Redis (for background tasks like email, notifications)


 Deployment (AWS)  :
EC2 instance with Nginx + Gunicorn for Django.

S3 for storing media/static files.

Route 53 domain: mysmartlearn.com.

Author   :
Raijo
Thrissur, India
Python & Django Developer


