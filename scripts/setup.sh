#!/bin/sh

# Usage:
# bash scripts/setup.sh param1 param2 param3 param4
# * param1: github username
# * param2: database/coturn username
# * param3: database/coturn password
# * param4: external IP

PROPERTY_FILE=./.env
FRONTEND_DIRECTORY=./frontend
INTERNAL_IP=$(ifconfig |grep 'inet 10'|  awk '{ print $2 }')
COTURN_DEFAULT_FILE=/etc/default/coturn
COTURN_CONFIG_FILE=/etc/turnserver.conf

git config user.email "$1@github.com"
git config user.name "$1"
git config credential.helper store

sudo apt-get update
sudo apt-get --assume-yes install python3
sudo apt-get --assume-yes install python3-pip
sudo apt-get --assume-yes install python3-venv
sudo apt-get --assume-yes install libmysqlclient-dev
sudo apt-get --assume-yes install coturn

python3 -m venv ../venv1
. ../venv1/bin/activate
pip3 install --upgrade pip
pip3 install -r requirements.txt

sudo mysql -u root -p" " -e"
create user '$2'@'%' identified by '$3';
GRANT ALL PRIVILEGES ON *.* TO '$2'@'%';
flush privileges;
"

sudo mysql -u root -p" " -e"
SET character_set_server = 'utf8';
create database db1_messenger;
"

echo "DATABASE_HOST=127.0.0.1" >> $PROPERTY_FILE
echo "DATABASE_USER=$2" >> $PROPERTY_FILE
echo "DATABASE_PASS=$3" >> $PROPERTY_FILE

echo "TURNSERVER_ENABLED=1" | sudo tee -a $COTURN_DEFAULT_FILE
echo "# setup.sh start" | sudo tee -a $COTURN_CONFIG_FILE
echo "listening-ip=$INTERNAL_IP" | sudo tee -a $COTURN_CONFIG_FILE
echo "external-ip=$4/$INTERNAL_IP" | sudo tee -a $COTURN_CONFIG_FILE
echo "min-port=49152" | sudo tee -a $COTURN_CONFIG_FILE
echo "max-port=65535" | sudo tee -a $COTURN_CONFIG_FILE
echo "fingerprint" | sudo tee -a $COTURN_CONFIG_FILE
echo "lt-cred-mech" | sudo tee -a $COTURN_CONFIG_FILE
echo "realm=testserver" | sudo tee -a $COTURN_CONFIG_FILE
echo "user=$2:$3" | sudo tee -a $COTURN_CONFIG_FILE
echo "# setup.sh end" | sudo tee -a $COTURN_CONFIG_FILE
sudo systemctl restart coturn.service