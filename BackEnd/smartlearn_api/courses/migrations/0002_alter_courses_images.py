# Generated by Django 5.1.4 on 2024-12-30 08:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='courses',
            name='images',
            field=models.ImageField(blank=True, null=True, upload_to='courses/'),
        ),
    ]
