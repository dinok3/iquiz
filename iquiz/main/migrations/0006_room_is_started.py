# Generated by Django 3.2.15 on 2022-10-24 16:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_room_owner'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='is_started',
            field=models.BooleanField(default=False, null=True),
        ),
    ]