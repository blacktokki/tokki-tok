from django.db import models, migrations, connections, DEFAULT_DB_ALIAS
from django_db_views.operations import ViewRunPython
from django.contrib.auth.models import AbstractUser, UserManager
from django_db_views.db_view import DBView


# Create your models here.
class User(AbstractUser, DBView):
    is_guest = models.BooleanField(help_text='게스트 여부')
    image_url = models.CharField(max_length=255, help_text='프로필 이미지 URL')

    view_definition = """
    SELECT
        us.us_id as id,
        us.us_username as username,
        '' as first_name,
        us.us_name as last_name,
        us.us_image_url as image_url,
        IF(us.us_is_guest, 1, 0) as is_guest,
        IF(us.us_is_admin, 1, 0) as is_staff,
        us.dt_created as date_joined,
        '' as password,
        1 as is_active,
        0 as is_superuser,
        '' as email,
        NOW() AS last_login
    FROM {0}.user as us
    """

    @property
    def name(self):
        return self.last_name

    class Meta:
        managed = False
        db_table = "user"


class BaseMigrationMixin:
    def _is_exclude_sql(self, sql):
        """
        view 테이블의 외래키 관련 DDL 제외처리
        """
        return sql.template.startswith('ALTER TABLE') and str(sql.parts.get('column', None)) in [
            '`user_id`']

    def _format_view_sql(self):
        """
        환경별 view_definition sql의 동적 처리
        """
        if self.app_label != 'accounts':
            return
        for op in self.operations:
            if isinstance(op, ViewRunPython):
                name = connections.databases[DEFAULT_DB_ALIAS]['NAME']
                if name == 'test_db1_messenger':
                    name = 'db1_messenger'
                db = name.replace('messenger', 'account')
                op.code.view_definition = op.code.view_definition.format(db)
                op.reverse_code.view_definition = op.reverse_code.view_definition.format(db)

    def apply(self, project_state, schema_editor, collect_sql=False):
        self._format_view_sql()
        result = super().apply(project_state, schema_editor, collect_sql)
        schema_editor.deferred_sql = [sql for sql in schema_editor.deferred_sql if not self._is_exclude_sql(sql)]
        return result


OldMigration = migrations.Migration
migrations.Migration = type(f'__{OldMigration.__name__}', (BaseMigrationMixin, OldMigration), {})
