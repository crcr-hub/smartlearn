import os
import boto3
import subprocess
from celery import shared_task
from django.conf import settings


s3_client = boto3.client(
    "s3",
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_REGION
)

@shared_task
def process_video_for_s3(module_id):
    """Converts video to HLS, uploads to S3, and updates model"""
    from .models import Modules
    try:
        print("Task started: process_video_for_s3")
        module = Modules.objects.get(id=module_id)
        video_file = os.path.join(settings.MEDIA_ROOT, module.video_path)

        # Convert to an absolute path
        video_file = os.path.abspath(video_file)

        # Debugging prints
        print(f"module.video_path = {module.video_path}")  # Stored path in DB
        print(f"Resolved video file path = {video_file}")  # Full absolute path

        # Ensure the file exists before proceeding
        if not os.path.exists(video_file):
            print(f"Error: File not found at {video_file}")
            return f"Error: File not found at {video_file}"
        module.update_status("Converting Video")
        course_name = module.course.name.replace(" ", "_")
        module_folder = f"{module.id}"

        resolutions = [("360p", "640x360"), ("420p", "854x420"), ("720p", "1280x720")]
        output_dir = f"/tmp/{module_folder}"
        os.makedirs(output_dir, exist_ok=True)

        # Generate HLS Master Playlist
        master_playlist_path = f"{output_dir}/master.m3u8"
        try:
            with open(master_playlist_path, "w") as master:
                master.write("#EXTM3U\n")
        except Exception as e:
            print(f"Error writing master playlist: {e}")
            return f"Error writing master playlist: {e}"

        for res, size in resolutions:
            res_folder = f"{output_dir}/{res}"
            os.makedirs(res_folder, exist_ok=True)

            output_m3u8 = f"{res_folder}/index.m3u8"
            ts_segment_path = f"{res_folder}/segment_%03d.ts"

            # Convert video using FFmpeg
            ffmpeg_command = [
                "ffmpeg",
                "-i", video_file,
                "-profile:v", "baseline",
                "-level", "3.0",
                "-s", size,
                "-start_number", "0",
                "-hls_time", "10",
                "-hls_list_size", "0",
                "-f", "hls",
                "-hls_segment_filename", ts_segment_path,
                output_m3u8
            ]

            print(f"Running FFmpeg command: {' '.join(ffmpeg_command)}")
            try:
                result = subprocess.run(ffmpeg_command, check=True, capture_output=True, text=True)
                print(f"FFmpeg Output:\n{result.stdout}")
                print(f"FFmpeg Error:\n{result.stderr}")
            except subprocess.CalledProcessError as e:
                print(f"FFmpeg failed: {e.stderr}")
                return f"FFmpeg failed: {e.stderr}"

            # Append to master playlist
            try:
                with open(master_playlist_path, "a") as master:
                    master.write(f'#EXT-X-STREAM-INF:BANDWIDTH=1500000,RESOLUTION={size}\n')
                    master.write(f'{res}/index.m3u8\n')
            except Exception as e:
                print(f"Error updating master playlist: {e}")
                return f"Error updating master playlist: {e}"
        module.update_status("Uploading to S3")

        # Upload files to S3
        s3_base_path = f"{module_folder}/"
        for root, dirs, files in os.walk(output_dir):
            for file in files:
                file_path = os.path.join(root, file)
                s3_key = os.path.relpath(file_path, output_dir).replace("\\", "/")  # Ensures proper S3 key format
                s3_key = f"{s3_base_path}{s3_key}"
                try:
                    print(f"Uploading {file_path} to S3 bucket {settings.AWS_STORAGE_BUCKET_NAME} at {s3_key}")
                    s3_client.upload_file(file_path, settings.AWS_STORAGE_BUCKET_NAME, s3_key)
                except Exception as e:
                    print(f"Failed to upload {file_path} to S3: {e}")
                    return f"Failed to upload {file_path} to S3: {e}"

        # Update Module with master.m3u8 URL
        s3_url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/{s3_base_path}master.m3u8"
        print("Successfully uploaded to S3:", s3_url)

        module.media = s3_url
        module.save(update_fields=['media'])
        module.update_status("Completed")

        return f"Processing complete. M3U8 available at {s3_url}"

    except Exception as e:
        print(f"Error processing video: {e}")
        return f"Error processing video: {e}"
    

import requests
import m3u8
from urllib.parse import urljoin    
@shared_task
def process_m3u8_duration(module_id, media_url):
    from .models import Modules  # Import inside function to avoid circular import
    import requests
    import m3u8
    from urllib.parse import urljoin

    try:
        response = requests.get(media_url, timeout=10)
        if response.status_code != 200:
            print(f"❌ M3U8 file is not accessible for module {module_id}")
            return None

        m3u8_obj = m3u8.loads(response.text)

        # 🔍 Check for master playlist
        if m3u8_obj.playlists:
            print(f"🔍 Detected master playlist for module {module_id}")
            first_variant_url = urljoin(media_url, m3u8_obj.playlists[0].uri)
            response = requests.get(first_variant_url, timeout=10)
            m3u8_obj = m3u8.loads(response.text)

        # 🔹 Extract segment durations
        total_duration = sum(segment.duration for segment in m3u8_obj.segments)
        if total_duration > 60:
            total_duration -= 60
        print(f"✅ Extracted Duration for module {module_id}: {total_duration} seconds")

        # ✅ Update module in the database
        module = Modules.objects.filter(id=module_id).first()  # Get the module instance
        if module:
            module.total_time = int(total_duration)
            module.save(update_fields=['total_time'])
            print(f"✅ Updated total_time for module {module_id}: {module.total_time}")
        else:
            print(f"❌ Module with ID {module_id} not found.")

        return total_duration

    except Exception as e:
        print(f"❌ Error processing M3U8 for module {module_id}: {e}")
        return None
