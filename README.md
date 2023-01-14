# kiblack-tok
[![Python](https://img.shields.io/badge/python-3.6.9-blue.svg?style=flat-square)](https://www.python.org/downloads/release/python-362/)
[![Django](https://img.shields.io/badge/django-3.2.16-blue.svg?style=flat-square)](https://www.djangoproject.com/)
[![Django Rest Framework](https://img.shields.io/badge/django_rest_framework-3.11.0-blue.svg?style=flat-square)](http://www.django-rest-framework.org/)

> #### A messenger service based on Python and Typescript. [Demo](/)

## Overview

+ Separated backend and frontend; Rest API; Micro service
+ Full cross-platform support(Desktop, Web, Mobile)
+ writing more...

Main modules are available below:

+ Messenger server(Django + React Native): [https://github.com/blacktokki/kiblack-tok](https://github.com/blacktokki/kiblack-tok)
+ Account server(SpringBoot): [https://github.com/blacktokki/blacktokki-account](https://github.com/blacktokki/blacktokki-account)

Screenshot from the architecture below:
+ writing more...

## Installation
    $ bash scripts/setup.sh <github username> <database username> <database password>

## Usage
### Run server
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

# run client development
$ npm run android
npm run ios
npm run web
npm run desktop
```

## Screenshots

### Frontend:

## Platform Support
+ Modern browsers(chrome, firefox) and Internet Explorer 10+.
+ Windows and MacOS desktop support.
+ Android and IOS mobile app support.