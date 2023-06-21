# tokki-tok
[![Python](https://img.shields.io/badge/python-3.8.0-blue.svg?style=flat-square)](https://www.python.org/downloads/release/python-380/)
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
![kitok drawio](https://github.com/blacktokki/tokki-tok/assets/39031723/e509396a-7ccf-4257-bc9f-6bedcea243be)
+ This project is a microservice architecture composed of account service and messenger service using Spring Cloud.
+ All static resources are deployed to Github Pages, and requests for static resources are entirely hosted on Github Pages.
+ Account and messenger service share account data using database replication.
+ Redis Pub/Sub and FCM were used to send messages to users participating in the chat. 
+ Cloud Storage was used for file upload and download.
+ Video call uses web rtc and is connected to p2p or sfu through kurento media server.

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
$ npm run web
```
