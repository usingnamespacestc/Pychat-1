# Generated by Django 3.0.8 on 2020-07-06 08:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user_info', '0005_auto_20200706_1558'),
    ]

    operations = [
        migrations.RenameField(
            model_name='lable',
            old_name='main_user_id',
            new_name='user_id',
        ),
    ]