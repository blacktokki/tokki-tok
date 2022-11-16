from django.db import models, migrations, connections, DEFAULT_DB_ALIAS
from django_db_views.operations import ViewRunPython
from django.contrib.auth.models import AbstractUser
from django_db_views.db_view import DBView

# Create your models here.
class User(AbstractUser, DBView):
    image_url = models.CharField(max_length=255, help_text='')
    
    view_definition = """
    SELECT
        us.us_id as id,
        us.us_username as username,
        '' as first_name,
        us.us_name as last_name,
        us.us_image_url as image_url,
        us.us_is_admin as is_staff,
        us.dt_created as date_joined,
        '' as password,
        1 as is_active,
        0 as is_superuser,
        '' as email,
        NOW() AS last_login
    FROM {0}.user as us
    """

    class Meta:
        managed = False
        db_table = "user"

class Group(DBView):
    id = models.IntegerField(db_column="gr_id", primary_key=True, serialize=False)
    image_url = models.CharField(db_column="gr_image_url", max_length=255, help_text='')
    name = models.CharField(db_column="gr_name", max_length=255, help_text='')
    parent_id = models.IntegerField(db_column="gr_parent_id", help_text='')
    root_id = models.IntegerField(db_column="gr_root_id", help_text='')
    
    view_definition = "SELECT * FROM {0}.group"
    
    def __str__(self):
        return self.name

    class Meta:
        managed = False
        db_table = "`group`"


class Membership(DBView):
    id = models.IntegerField(db_column="mb_id", primary_key=True, serialize=False)
    user = models.ForeignKey(User, db_column="us_id", on_delete=models.CASCADE, help_text='')
    group = models.ForeignKey(Group, db_column="gr_id", on_delete=models.CASCADE, help_text='')

    view_definition = "SELECT * FROM {0}.membership"

    class Meta:
        managed = False
        db_table = "member"


class BaseMigrationMixin:
    def _is_exclude_sql(self, sql):
        return sql.template.startswith('ALTER TABLE') and str(sql.parts.get('column', None)) in ['`user_id`', '`group_id`', '`membership_id`']

    def _format_view_sql(self):
        if self.app_label != 'account':
            return
        for op in self.operations:
            if isinstance(op, ViewRunPython):
                name = connections.databases[DEFAULT_DB_ALIAS]['NAME']
                db = name.replace('messenger', 'task')
                op.code.view_definition = op.code.view_definition.format(db)
                op.reverse_code.view_definition = op.reverse_code.view_definition.format(db)

    def apply(self, project_state, schema_editor, collect_sql=False):
        self._format_view_sql()
        result = super().apply(project_state, schema_editor, collect_sql)
        schema_editor.deferred_sql = [sql for sql in schema_editor.deferred_sql if not self._is_exclude_sql(sql)]
        return result

OldMigration = migrations.Migration
migrations.Migration = type(f'__{OldMigration.__name__}', (BaseMigrationMixin, OldMigration), {})
