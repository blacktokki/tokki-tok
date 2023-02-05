#!/bin/sh

# Usage:
# bash scripts/runserver.sh [param]...
# bash ../scripts/runserver.sh [param]...
# * param: service name (gunicorn|eureka_client)

for var in "$@"
do
    PID=`ps -ef | grep python | grep $var | awk '{print $2}'`
    if [ -n "$PID" ]
    then
        echo "=====$var is running at" $PID
        kill -9 $PID
    else
        echo "=====$var isn't running====="
    fi
done