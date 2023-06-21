#!/bin/sh

# Usage:
# bash scripts/setup.sh param1 param2 param3
# * param1: external ip
# * param2: coturn username
# * param3: coturn password

EXTERNAL_IP=$1
INTERNAL_IP=$(ifconfig |grep 'inet 10'|  awk '{ print $2 }')
COTURN_DEFAULT_FILE=/etc/default/coturn
COTURN_CONFIG_FILE=/etc/turnserver.conf
sudo apt-get --assume-yes install coturn
echo "TURNSERVER_ENABLED=1" | sudo tee -a $COTURN_DEFAULT_FILE
echo "# setup.sh start" | sudo tee -a $COTURN_CONFIG_FILE
echo "listening-ip=$INTERNAL_IP" | sudo tee -a $COTURN_CONFIG_FILE
echo "external-ip=$EXTERNAL_IP/$INTERNAL_IP" | sudo tee -a $COTURN_CONFIG_FILE
echo "min-port=49152" | sudo tee -a $COTURN_CONFIG_FILE
echo "max-port=65535" | sudo tee -a $COTURN_CONFIG_FILE
echo "fingerprint" | sudo tee -a $COTURN_CONFIG_FILE
echo "lt-cred-mech" | sudo tee -a $COTURN_CONFIG_FILE
echo "realm=testserver" | sudo tee -a $COTURN_CONFIG_FILE
echo "user=$2:$3" | sudo tee -a $COTURN_CONFIG_FILE
echo "# setup.sh end" | sudo tee -a $COTURN_CONFIG_FILE
sudo systemctl restart coturn.service