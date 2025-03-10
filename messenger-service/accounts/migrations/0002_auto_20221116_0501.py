# Generated by Django 3.2.16 on 2022-11-16 05:01

from django.db import migrations
import django_db_views.migration_functions
import django_db_views.operations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        django_db_views.operations.ViewRunPython(
            code=django_db_views.migration_functions.ForwardViewMigration("SELECT\n        us.us_id as id,\n        us.us_username as username,\n        '' as first_name,\n        us.us_name as last_name,\n        us.us_image_url as image_url,\n        us.us_is_admin as is_staff,\n        us.dt_created as date_joined,\n        '' as password,\n        1 as is_active,\n        0 as is_superuser,\n        '' as email,\n        NOW() AS last_login\n    FROM {0}.user as us", 'user', engine='django.db.backends.mysql'),
            reverse_code=django_db_views.migration_functions.BackwardViewMigration('', 'user', engine='django.db.backends.mysql'),
            atomic=False,
        )
    ]
