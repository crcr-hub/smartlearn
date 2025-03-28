# Generated by Django 5.1.4 on 2025-02-19 13:54

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0017_alter_notification_notification_type'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name='progress',
            name='enrolled_course',
        ),
        migrations.RemoveField(
            model_name='progress',
            name='last_watched_timestamp',
        ),
        migrations.AddField(
            model_name='progress',
            name='last_updated',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='progress',
            name='progress',
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name='progress',
            name='student',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
