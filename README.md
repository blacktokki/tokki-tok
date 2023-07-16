# tokki-tok
[![Python](https://img.shields.io/badge/python-3.8.10-blue.svg?style=flat-square)](https://www.python.org/downloads/release/python-3810/)
[![Django](https://img.shields.io/badge/django-3.2.16-blue.svg?style=flat-square)](https://www.djangoproject.com/)
[![Django Rest Framework](https://img.shields.io/badge/django_rest_framework-3.11.0-blue.svg?style=flat-square)](http://www.django-rest-framework.org/)

> #### 파이썬과 타입스크립트로 만든 화상회의 및 메신저 서비스입니다.
![제목 없는 다이어그램 drawio](https://github.com/blacktokki/tokki-tok/assets/39031723/86ed7f8c-f37e-4801-9f15-a08d4f687745)


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
![kitok drawio](https://github.com/blacktokki/tokki-tok/assets/39031723/44c81853-47c7-4792-96af-94c80201ddcc)

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
