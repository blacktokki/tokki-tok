# Generated by Django 3.2.16 on 2023-06-26 08:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('messenger', '0010_alter_channel_owner'),
    ]

    operations = [
        migrations.AddField(
            model_name='channelcontent',
            name='is_archive',
            field=models.BooleanField(db_column='cc_is_archive', default=False),
        ),
    ]