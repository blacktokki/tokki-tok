#!/bin/sh

# Usage:
# bash scripts/setup.sh param1 param2
# * param1: database username
# * param2: database password, secret key

PROPERTY_FILE=./messenger-service/backend/.env
MYSQL_CONFIG_FILE=/etc/mysql/my.cnf

sudo add-apt-repository --yes ppa:redislabs/redis
sudo apt-get update
sudo apt-get --assume-yes install python3.8 python3.8-dev python3.8-venv
sudo apt-get --assume-yes install python3-pip
sudo apt-get --assume-yes install nginx
sudo apt-get --assume-yes install libmysqlclient-dev
sudo apt-get --assume-yes install redis-server

sudo apt-get install build-essential python-setuptools python-smbus libffi-dev libsqlite3-dev
PYTHON_VERSION=3.8.10
PYTHON_PACKAGE=Python-$PYTHON_VERSION
sudo wget https://www.python.org/ftp/python/$PYTHON_VERSION/$PYTHON_PACKAGE.tgz
sudo tar xzf $PYTHON_PACKAGE.tgz
cd $PYTHON_PACKAGE
sudo ./configure --enable-optimizations
sudo make altinstall
cd ..
rm -rf $PYTHON_PACKAGE $PYTHON_PACKAGE.tgz

python3.8 -m venv ../venv1
. ../venv1/bin/activate
pip3 install --upgrade pip
pip3 install -r requirements.txt

sudo mysql -u root -p" " -e"
create user '$1'@'%' identified by '$2';
GRANT ALL PRIVILEGES ON *.* TO '$1'@'%';
flush privileges;
"

sudo mysql -u root -p" " -e"
SET character_set_server = 'utf8mb4';
create database db1_messenger;
"

# sudo sysctl net.ipv4.conf.all.route_localnet=1
# sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 127.0.0.1:8000
sudo cp ./scripts/nginx.conf /etc/nginx/conf.d/messenger.conf
sudo unlink /etc/nginx/sites-enabled/default

echo "DATABASE_HOST=127.0.0.1" >> $PROPERTY_FILE
echo "DATABASE_USER=$1" >> $PROPERTY_FILE
echo "DATABASE_PASS=$2" >> $PROPERTY_FILE
echo "SECRET_KEY=$2" >> $PROPERTY_FILE

## replication DB
echo "[mysqld]" >> $MYSQL_CONFIG_FILE
echo "server-id=2" >> $MYSQL_CONFIG_FILE
echo "expire_logs_days=7" >> $MYSQL_CONFIG_FILE
echo "replicate-do-db='db1_account'" >> $MYSQL_CONFIG_FILE
sudo systemctl stop mysql
sudo rm -rf /var/lib/mysql/auto.cnf
sudo systemctl restart mysql

MASTER_HOST=10.178.0.4
result=`mysql -h $MASTER_HOST -u $1 -p'$2' -B -N -e "show master status"`
binlog=`echo $result | awk '{print $1}'`
position=`echo $result | awk '{print $2}'`
sudo mysql -u root -p" " -e"
CHANGE MASTER TO
    MASTER_HOST='$MASTER_HOST', 
    MASTER_USER='$1',
    MASTER_PASSWORD='$2',
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
# echo "turnURL=$1:$2@$MASTER_HOST:3478?transport=udp" | sudo tee -a $WEBRTC_CONFIG_FILE
sudo systemctl restart kurento-media-server.service
