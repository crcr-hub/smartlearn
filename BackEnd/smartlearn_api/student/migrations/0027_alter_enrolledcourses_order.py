# Generated by Django 5.1.4 on 2025-03-06 16:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0026_order_items_created_at_remove_enrolledcourses_order_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='enrolledcourses',
            name='order',
            field=models.ManyToManyField(blank=True, to='student.order_items'),
        ),
    ]
