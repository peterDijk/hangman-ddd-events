#!/bin/sh

export DIR_DATA_PATH="$PWD"

export CONTAINER_COMMAND="npm run start:dev"
export CONTAINER_SCALE="1"
export APP_PORT="7070"
export CONTAINER_PORT="3000"
export GQL_PLAYGROUND="true"

docker-compose up
