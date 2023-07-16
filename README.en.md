# tokki-tok
[![Python](https://img.shields.io/badge/python-3.8.10-blue.svg?style=flat-square)](https://www.python.org/downloads/release/python-3810/)
[![Django](https://img.shields.io/badge/django-3.2.16-blue.svg?style=flat-square)](https://www.djangoproject.com/)
[![Django Rest Framework](https://img.shields.io/badge/django_rest_framework-3.11.0-blue.svg?style=flat-square)](http://www.django-rest-framework.org/)

> #### A messenger service with video call based on Python and Typescript.
![제목 없는 다이어그램 drawio](https://github.com/blacktokki/tokki-tok/assets/39031723/df1d177c-07dc-4d36-b964-f217409b902d)

## Overview

+ Rest API & Real-time chat functionality using websocket
+ Video call functionality using webrtc
+ File upload & download
+ web push notification support
+ User authentication using JWT
+ Mobile responsible design 
+ Documented with swagger

Main modules are available below:

+ Messenger server(Django + React Native): [https://github.com/blacktokki/tokki-tok](https://github.com/blacktokki/tokki-tok)
+ Account server(SpringBoot): [https://github.com/blacktokki/blacktokki-account](https://github.com/blacktokki/blacktokki-account)

## Architecture
![kitok drawio](https://github.com/blacktokki/tokki-tok/assets/39031723/c8dbadb6-7eaa-42c7-a773-187ee5d885d7)

## Installation
### Install account server
    $ git clone https://github.com/blacktokki/blacktokki-account![Uploading kitok.drawio.png…]()

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
$ npm run web
```
