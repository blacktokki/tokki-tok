#!/bin/sh

# Usage:
# bash scripts/setup.sh param1 param2 param3
# * param1: github username
# * param2: database username
# * param3: database password, secret key

PROPERTY_FILE=./messenger-service/backend/.env
MYSQL_CONFIG_FILE=/etc/mysql./my.cnf

git config user.email "$1@github.com"
git config user.name "$1"
git config credential.helper store

sudo add-apt-repository --yes ppa:redislabs/redis
sudo apt-get update
sudo apt-get --assume-yes install python3
sudo apt-get --assume-yes install python3-pip
sudo apt-get --assume-yes install python3-venv
sudo apt-get --assume-yes install libmysqlclient-dev
sudo apt-get --assume-yes install redis-server

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

sudo sysctl net.ipv4.conf.all.route_localnet=1
sudo iptables -t nat -A PREROUTING -p tcp --dport 8000 -j DNAT --to-destination 127.0.0.1:8000

echo "DATABASE_HOST=127.0.0.1" >> $PROPERTY_FILE
echo "DATABASE_USER=$2" >> $PROPERTY_FILE
echo "DATABASE_PASS=$3" >> $PROPERTY_FILE
echo "SECRET_KEY=$3" >> $PROPERTY_FILE

## replication DB
echo "[mysqld]" >> $MYSQL_CONFIG_FILE
echo "server-id=2" >> $MYSQL_CONFIG_FILE
echo "expire_logs_days=7" >> $MYSQL_CONFIG_FILE
echo "replicate-do-db='db1_account'" >> $MYSQL_CONFIG_FILE
sudo systemctl stop mysql
sudo rm -rf /var/lib/mysql/auto.cnf
sudo systemctl restart mysql

MASTER_HOST=10.178.0.4
result=`mysql -h $MASTER_HOST -u $2 -p'$3' -B -N -e "show master status"`
binlog=`echo $result | awk '{print $1}'`
position=`echo $result | awk '{print $2}'`
sudo mysql -u root -p" " -e"
CHANGE MASTER TO
    MASTER_HOST='$MASTER_HOST', 
    MASTER_USER='$2',
    MASTER_PASSWORD='$3',
    MASTER_LOG_FILE='$binlog', 
    MASTER_LOG_POS=$position;
start slave;
"

## setup kurento
WEBRTC_CONFIG_FILE=/etc/kurento/modules/kurento/WebRtcEndpoint.conf.ini
sudo apt-get --assume-yes install gnupg
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 5AFA7A83
echo "deb [arch=amd64] http://ubuntu.openvidu.io/6.16.0 bionic kms6" | sudo tee /etc/apt/sources.list.d/kurento.list
sudo apt-get --assume-yes install kurento-media-server
echo "stunServerAddress=172.217.213.127" | sudo tee -a $WEBRTC_CONFIG_FILE
echo "stunServerPort=19302" | sudo tee -a $WEBRTC_CONFIG_FILE
# echo "turnURL=$2:$3@$MASTER_HOST:3478?transport=udp" | sudo tee -a $WEBRTC_CONFIG_FILE
sudo systemctl restart kurento-media-server.service
