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
APP_PORT=7070
CONTAINER_PORT=3000
PROJECTIONS_HOSTNAME=projections.db
PROJECTIONS_PORT=3306
PROJECTIONS_CREDENTIALS_USERNAME=root
PROJECTIONS_CREDENTIALS_PASSWORD=example
PROJECTIONS_DB_TYPE=mysql
PROJECTIONS_DATABASE=hangman-projections
STORE_STATE_HOSTNAME=eventstore.db
STORE_STATE_PORT=27017
STORE_STATE_DB_TYPE=mongodb
STORE_STATE_USERNAME=root
STORE_STATE_PASSWORD=example
STORE_STATE_DB=store-state-db
STORE_STATE_EVENTS_DB=eventstore
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

- graphql: http://localhost:7070/graphql
- eventstore: https://localhost:2113
- rest api: see Swagger documentation on http://localhost:7070/api

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
