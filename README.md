<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a> HANGMAN
</p>

## Description

project to learn about DDD and Event Sourcing

in a Docker setup using Eventstore

Goal : Have a complete template application for a Domain Driven/ Event Sourced backend using NestJS.

## ToDo / Done

- [x] Setup NestJS architecture
- [x] API controller and GraphQL resolver use the games.service for mutation and query
- [x] Setup CQRS Game domain: commands, commandhandlers, call aggregate methods, applying events to aggregate, catching event in eventhandler
- [x] dockerize project, app + projections container
- [x] setup projection-db with typeorm: eventhandlers update projection
- [x] service has methods using typeorm that return the results from the projections-db
- [x] Build eventstore module with custom publisher, custom eventbus, and reading from/ writing to EventstoreDB using evenstore client. Learned a lot about NestJS dependency injection
- [x] extract new module into npm library
- [x] aggregate's applied events are stored in eventstoredb
- [x] eventstore module is subscribed to eventstore stream and adds new events to the NestJS cqrs EventBus (meaning it will end up in the EventHandlers)
- [x] added ViewEventBus to the eventstore module, including writing a custom ViewUpdater decorator. Any class decorated with this decorator (typing enforces it needs a `handle` method) will get registered in the ViewUpdaters. Any event published onto the ViewEventBus will look for the matching registered updater class, and will call it's `handle` method
- [x] added ViewUpdater classes that update the projection to the application. Decorated with `@ViewUpdaterHandler(EventClass)` it will handle the event coming from EventstoreDB
- [x] implement multiple aggregates/ streams possibility into the nestjs-eventstoredb library

sept 2022

- [x] NestJS new setup working latest version
- [x] better filestructure
- [x] GQL working
- [x] Games domain working via CQRS
- [x] Dockerize the project
- [x] Eventstore setup working
- [x] Add Users domain (Aggregate with createNew method, commands, cmdhandlers, events, eventhandlers, viewupdaterhandlers)
- [x] TypeORM setup working
- [x] Updaters are updating projections
- [x] TypeORM migrations
- [x] Merge updateDependencies branch to master
- [x] using latest dependencies versions complete, merge updateDependencies branch to master
- [x] store last processed event checkpoint, on app init only replay from checkpoint (read checkpoint from stream)
- [x] update dependencies
- [ ] setup ConfigService
- [ ] include config in repo instead of .env for easier sharing and running of project
- [ ] endpoint and/ or script that runs replay of events from beginning
- [ ] Add Auth module
- [ ] Add User to Game
- [ ] Swap projection database type for mongodb
- [ ] Swap projection for a database type that GraphQL reads from directly (for actual performance improv. reason for GQL. Without it's only dev experience)
- [ ] Implement actual hangman logic. Goal: backend is ready for comm with frontend
- [ ] Setup websocket server
- [ ] ...

### Frontend:

- [ ] setup hangman app in this dockerized project
- [ ] add user login and start new game UI (pick wordToGuess from randomized public api)
- [ ] setup websocket client: connect to server on login, receive init message in redux middleware, mutate state (after making guess, the backend sends the so far rightly guessed characters on the correct positions)
- [ ]

## Known issues

- when working on the npm package, `npm link` to test out the latest version of the package without publishing makes NestJS clash. something with peer dependencies?

## Installation

### prepare `.env` file for environment variables with content:

```bash
DIR_DATA_PATH="$PWD"
CONTAINER_COMMAND="npm run start"
CONTAINER_SCALE="1"
APP_PORT=5050
CONTAINER_PORT=4000
EVENTSTORE_CLUSTER_SIZE=1
EVENTSTORE_RUN_PROJECTIONS=All
EVENTSTORE_START_STANDARD_PROJECTIONS=true
EVENTSTORE_EXT_TCP_PORT=1113
EVENTSTORE_EXT_HTTP_PORT=2113
EVENTSTORE_INSECURE=true
EVENTSTORE_ENABLE_EXTERNAL_TCP=true
EVENTSTORE_ENABLE_ATOM_PUB_OVER_HTTP=true
EVENT_STORE_HOSTNAME=hangman-eventstore
PROJECTIONS_HOSTNAME=hangman-projections
PROJECTIONS_PORT=3310
PROJECTIONS_CREDENTIALS_USERNAME=root
PROJECTIONS_CREDENTIALS_PASSWORD=example
PROJECTIONS_DB_TYPE=mysql
PROJECTIONS_DATABASE=hangman-projections
STORE_STATE_DB_TYPE=mongodb
STORE_STATE_HOSTNAME=hangman-position
STORE_STATE_PORT=27017
STORE_STATE_USERNAME=root
STORE_STATE_PASSWORD=example
STORE_STATE_DB=hangman-position
MONGO_PROJECTIONS_HOSTNAME=hangman-projections
MONGO_PROJECTIONS_PORT=27017
MONGO_PROJECTIONS_CREDENTIALS_USERNAME=root
MONGO_PROJECTIONS_CREDENTIALS_PASSWORD=example
MONGO_PROJECTIONS_DB_TYPE=mongodb
MONGO_PROJECTIONS_DATABASE=hangman-projections-mongo
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
