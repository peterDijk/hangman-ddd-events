<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a> HANGMAN
</p>

## Description

project to learn about DDD and Event Sourcing

in a Docker setup using Eventstore

## Installation

### prepare `.env` file for environment variables with content:

```bash
DIR_DATA_PATH="$PWD"
CONTAINER_COMMAND="npm run start"
CONTAINER_SCALE="1"
APP_PORT="7070"
CONTAINER_PORT="3000"
EVENTSTORE_CLUSTER_SIZE=1
EVENTSTORE_RUN_PROJECTIONS=All
EVENTSTORE_START_STANDARD_PROJECTIONS=true
EVENTSTORE_EXT_TCP_PORT=1113
EVENTSTORE_EXT_HTTP_PORT=2113
EVENTSTORE_INSECURE=true
EVENTSTORE_ENABLE_EXTERNAL_TCP=true
EVENTSTORE_ENABLE_ATOM_PUB_OVER_HTTP=true
EVENT_STORE_HOSTNAME=eventstore.db
PROJECTIONS_HOSTNAME=projections.db
PROJECTIONS_PORT=3306
PROJECTIONS_CREDENTIALS_USERNAME=root
PROJECTIONS_CREDENTIALS_PASSWORD=example
PROJECTIONS_DB_TYPE=mysql
PROJECTIONS_DATABASE=hangman-projections
GQL_PLAYGROUND=enabled
```

### Migrations

Will be run on start of the container

To run manually:

```bash
$ docker-compose exec hangman-ddd-events npm run migration:run

# after adding model(s) or make changes to models, generate new migration:
$ docker-compose exec hangman-ddd-events npm run migration:generate -- [migration-name]
```

```bash
$ docker-compose build
```

## Running the app

```bash
# development
$ docker-compose up
```

## Interfaces

- graphql: https://localhost:7070/graphql
- eventstore: https://localhost:2113

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
