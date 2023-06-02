"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 3.2.16.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""

import environ
from pathlib import Path
from google.oauth2 import service_account

# Initialise environment variables
env = environ.Env()
environ.Env.read_env()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# SECRET_KEY = 'django-insecure-d6^l_5=6fby&+kh(i+a(xq)pwmokvr6w^!+rqgi_$p8(p$s!36'
SECRET_KEY = env('SECRET_KEY')
FCM_API_KEY = env('FCM_API_KEY')
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'channels',
    'rest_framework',
    'django_filters',
    'django_db_views',
    'accounts',
    'notifications',
    'messenger',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'
ASGI_APPLICATION = 'backend.asgi.application'

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("localhost", 6379)],
        },
    },
}

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'db1_messenger',
        'USER': env('DATABASE_USER'),
        'PASSWORD': env('DATABASE_PASS'),
        'HOST': env('DATABASE_HOST'),
        'PORT': '3306',
    }
}

# Storage
# https://django-storages.readthedocs.io/en/latest/backends/gcloud.html
DEFAULT_FILE_STORAGE = 'storages.backends.gcloud.GoogleCloudStorage'

GS_CREDENTIALS = service_account.Credentials.from_service_account_file(
    Path.joinpath(BASE_DIR, 'virtual-metrics-355712-e207b739a975.json'))
GS_BUCKET_NAME = 'blacktokki-storage'
GS_LOCATION = 'messenger'

# Auth settings
AUTH_USER_MODEL = "accounts.user"
AUTHENTICATION_BACKENDS = [
    'accounts.backends.AuthBackend',
    # 'django.contrib.auth.backends.ModelBackend',
]

# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Seoul'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = '/static/'

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

ACCOUNT_SERVICE_DOMAIN = 'localhost:8080'

REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'rest_framework.schemas.coreapi.AutoSchema',
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'DEFAULT_PERMISSION_CLASSES': (
        "rest_framework.permissions.IsAuthenticated",
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
        'accounts.authentication.CsrfExemptSessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ),
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        # 'drf_replace_ordering_filter.filters.ReplaceFieldsOrderingFilter'
    ],
}

JWT_AUTH = {
    'JWT_PAYLOAD_GET_USERNAME_HANDLER': lambda payload: payload.get('sub')
}

# LOGGING = {
#     'version': 1,
#     'disable_existing_loggers': False,
#     'handlers': {
#         'console':{
#             'level': 'DEBUG',
#             'class': 'logging.StreamHandler'
#         }
#     },
#     'loggers':{
#         'django.db.backends':{
#             'handlers': ['console'],
#             'level': 'DEBUG'
#         }
#     }
# }
