#!/bin/sh

# Usage:
# bash scripts/runserver.sh [param]...
# bash ../scripts/runserver.sh [param]...
# * param: service name (messneger|eureka_client)

for var in "$@"
do
    PID=`ps -ef | grep python | grep $var | awk '{print $2}'`
    if [ -n "$PID" ]
    then
        echo "=====$var is running at" $PID
    else
        DIR=`find ../ -name messenger-service -type d`
        if [ "$var" == "messenger" ]
        then
            echo "=====$var isn't running====="
            nohup gunicorn backend.asgi:application -k uvicorn.workers.UvicornWorker --chdir $DIR >/dev/null 2>&1 &
        elif [ "$var" == "eureka_client" ]
        then
            echo "=====$var isn't running====="
            nohup $DIR/manage.py eureka_client >/dev/null 2>&1 &
        fi
    fi
done