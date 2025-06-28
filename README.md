# SmartLearn
SmartLearn is a modern, scalable online learning platform built with **React** and **Django**, supporting video-based courses, real-time chat, and automated media processing with **Celery**, **Redis**, and **AWS S3**.

##  Features
### For Students
- Register and login using JWT authentication
- Enroll in public courses
- View and update profile 
- Chat with instructors in real-time (WebSocket via Django Channels)

###  For Teachers
- Register accounts
- Dashboard showing enrolled students and transactions
- Add abd Access to course data
- Update profile and change password
- Live chat support with enrolled students

### For Admins
- Full control over users (students, teachers)
- Register and manage users
- Controll course workFlow
- Dashboard with analytics: user count, courses, transactions

###  Video Processing (Background)
- Course videos uploaded by teachers are automatically:
  - Converted to lower bitrate (optimized for streaming)
  - Processed in the background using **Celery** and **Redis**
  - Uploaded to AWS S3


###  Tech Stack
- **Frontend:** React + Redux Toolkit 
- **Backend:** Django + Django REST Framework + Channels
- **Task Queue:** Celery
- **Broker & Backend:** Redis
- **Video Processing:** `ffmpeg` for bitrate conversion
- **Database:** Sqlite3
- **Auth:** JWT
- **Payments:** Razorpay integration
- **Deployment:** 
  - Backend: AWS EC2 + NGINX + Gunicorn + Certbot (SSL)
  - Frontend: Vercel

##  Background Video Processing with Celery

###  Workflow
1. Teacher uploads a raw video.
2. Celery worker picks up the task.
3. `ffmpeg` converts the video to optimized bitrate (e.g., 480p or 720p).
4. Processed video is saved to **AWS S3**.
5. Frontend gets updated video URL via API.

##  .env file Configuration
### AWS S3
AWS_ACCESS_KEY_ID=aws_access_key
AWS_SECRET_ACCESS_KEY=yaws_secret_key
AWS_STORAGE_BUCKET_NAME=AWS_BUCKET_NAME
AWS_REGION=ap-southeast-2

### Razorpay
RAZORPAY_KEY_ID=razorpay_key_id
RAZORPAY_KEY_SECRET=razorpay_key_secret

### Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=email
EMAIL_HOST_PASSWORD=app_password

Author
Raijo Raj
📍 Thrissur, Kerala
🧑‍💻 Passionate Django/React developer
📫 Email: raijocraj@gmail.com