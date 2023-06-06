# tokki-tok
[![Python](https://img.shields.io/badge/python-3.6.9-blue.svg?style=flat-square)](https://www.python.org/downloads/release/python-362/)
[![Django](https://img.shields.io/badge/django-3.2.16-blue.svg?style=flat-square)](https://www.djangoproject.com/)
[![Django Rest Framework](https://img.shields.io/badge/django_rest_framework-3.11.0-blue.svg?style=flat-square)](http://www.django-rest-framework.org/)

> #### 파이썬과 타입스크립트로 만든 화상회의 및 메신저 서비스입니다.
![제목 없는 다이어그램 drawio](https://github.com/blacktokki/tokki-tok/assets/39031723/df1d177c-07dc-4d36-b964-f217409b902d)

## Overview

주요 기능:
+ REST API와 웹소켓을 사용한 실시간 채팅
+ WebRTC를 사용한 화상 회의
+ 파일 업로드 및 다운로드
+ 웹 푸시 알림
+ JWT를 사용한 사용자 인증
+ 모바일 반응형 디자인
+ Swagger로 문서화

서브 프로젝트:
+ Messenger server(Django + React Native): [https://github.com/blacktokki/tokki-tok](https://github.com/blacktokki/tokki-tok)
+ Account server(SpringBoot): [https://github.com/blacktokki/blacktokki-account](https://github.com/blacktokki/blacktokki-account)

## Architecture
![kitok drawio](https://github.com/blacktokki/tokki-tok/assets/39031723/e509396a-7ccf-4257-bc9f-6bedcea243be)
+ Spring Cloud를 사용하여 계정 서비스와 메신저 서비스로 구성된 마이크로서비스 아키텍처입니다.
+ 모든 정적 리소스는 Github Pages에 배포되며, 정적 리소스에 대한 요청은 Github Pages에서 호스팅됩니다.
+ 계정 및 메신저 서비스는 데이터베이스 Replication을 통해 계정 데이터를 공유합니다.
+ 채팅 참여자에게 메시지를 전송하기 위해 Redis Pub/Sub 및 FCM이 사용되었습니다.
+ 파일 업로드 및 다운로드에는 Cloud Storage가 사용되었습니다.
+ 화상회의는 WebRTC를 사용하며, P2P 또는 Kurento 미디어 서버를 통해 SFU방식으로 연결됩니다.

## Installation
### account server 설치
    $ git clone https://github.com/blacktokki/blacktokki-account
    $ cd blacktokki-account
    $ bash scripts/setup.sh <github username> <database username> <database password>
### messenger server 설치
    $ bash scripts/setup.sh <github username> <database username> <database password>

## Usage
### account server 실행
```sh
# run account services
$ bash scripts/runserver.sh discovery gateway account
```
### messenger server 실행
```sh
# run backend with gunicorn
$ bash scripts/runserver.sh gunicorn

# connect to discovery server
$ bash scripts/runserver.sh eureka_client
```
### client 실행
```sh
# cd into frontend directory
$ cd frontend

# generate .env and web/firebase-config.js file
$ npm run env

# run client development
$ npm run web
```
