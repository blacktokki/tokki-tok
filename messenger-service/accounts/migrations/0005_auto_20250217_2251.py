# Generated by Django 3.2.16 on 2025-02-17 13:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_auto_20231003_2028'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Group',
        ),
        migrations.DeleteModel(
            name='Membership',
        ),
    ]
