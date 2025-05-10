Description 
SmartLearn is an online learning platform where students can enroll in courses, make payments via Razorpay or PayPal, and access their learning dashboard.
It features an admin panel, teacher management, and secure JWT-based authentication.
Features
- Student registration and login
- Teacher management (by admin)
- Course listing and enrollment
- Payments via Razorpay and PayPal
- JWT authentication
- User profile and image upload
- Real-time chat using Django Channels
- Hosted on AWS with Nginx, Gunicorn, and SSL

**  Tech Stack**

**Frontend:**
- React
- Redux Toolkit
- Axios
- Bootstrap

**Backend:**
- Django
- Django REST Framework
- Django Channels
- Celery + Redis

**DevOps & Hosting:**
- AWS EC2
- PostgreSQL (RDS)
- Nginx + Gunicorn
- Certbot (SSL)
- S3 for media storage

## Installation

### Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
