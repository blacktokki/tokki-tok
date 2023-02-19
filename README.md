# tokki-tok
[![Python](https://img.shields.io/badge/python-3.6.9-blue.svg?style=flat-square)](https://www.python.org/downloads/release/python-362/)
[![Django](https://img.shields.io/badge/django-3.2.16-blue.svg?style=flat-square)](https://www.djangoproject.com/)
[![Django Rest Framework](https://img.shields.io/badge/django_rest_framework-3.11.0-blue.svg?style=flat-square)](http://www.django-rest-framework.org/)

> #### A messenger service based on Python and Typescript.

## Overview

+ Separated backend and frontend; Rest API; Micro service
+ Full cross-platform support
+ Documented with swagger
+ Real-time chat functionality using websocket
+ User authentication using JWT

Main modules are available below:

+ Messenger server(Django + React Native): [https://github.com/blacktokki/tokki-tok](https://github.com/blacktokki/tokki-tok)
+ Account server(SpringBoot): [https://github.com/blacktokki/blacktokki-account](https://github.com/blacktokki/blacktokki-account)

Screenshot from the architecture below:
![제목 없는 다이어그램 drawio](https://user-images.githubusercontent.com/39031723/218319322-17abaf36-cc65-4cb7-94b8-966d7a54990e.png)


## Installation
### Install account server
    $ git clone https://github.com/blacktokki/blacktokki-account
    $ cd blacktokki-account
    $ bash scripts/setup.sh <github username> <database username> <database password>
### Install messenger server
    $ bash scripts/setup.sh <github username> <database username> <database password>

## Usage
### Run account server
```sh
# run account services
$ bash scripts/runserver.sh discovery gateway account
```
### Run messenger server
```sh
# run backend with gunicorn
$ bash scripts/runserver.sh gunicorn

# connect to discovery server
$ bash scripts/runserver.sh eureka_client
```
### Run client
```sh
# cd into frontend directory
$ cd frontend

# generate .env and web/firebase-config.js file
$ npm run env

# run client development
$ npm run android
$ npm run ios
$ npm run web
$ npm run desktop
```

## Screenshots
### Messenger Screen
![제목 없음2](https://user-images.githubusercontent.com/39031723/214096452-1061190e-c738-422f-bfc1-b0a8ec9edeaf.png)
### Board Screen
![제목 없음22](https://user-images.githubusercontent.com/39031723/214096456-15c7c147-fb68-4b42-8346-af43b0ae4892.png)


<!-- ### Read More -->
