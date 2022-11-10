#! /bin/bash

stty -echoctl

trap "ctrl_c" SIGINT

ctrl_c() {
    echo "shutting down network..."

}
docker container prune
# docker rm trading-platform_kafka_1 trading-platform_zookeeper_1 
export PRI_IP=$(hostname -I | awk '{print $1}')

docker-compose up