import { Injectable, Logger } from '@nestjs/common';
import { GameDto } from '../../Infrastructure/Dto/Game.dto';
import { Game } from '../AggregateRoot/Game.aggregate';
// import { EventStore } from '@berniemac/event-sourcing-nestjs';
import { EventStoreDBClient } from '@eventstore/db-client';

@Injectable()
export class GamesRepository {
  // constructor() {} // private readonly eventStore: EventStore
  private logger = new Logger(GamesRepository.name);

  // https://stackoverflow.com/questions/64769673/nestjs-external-event-bus-implementation-with-redis
  private client = EventStoreDBClient.connectionString(
    'esdb://eventstore.db:2113?tls=false',
  );

  async findOneById(aggregateId: string): Promise<Game> {
    const game = new Game(aggregateId);

    // find using own method
    const events = await this.client.readStream(aggregateId);
    this.logger.log(`events: ${events}`);

    // const eventHistory = await this.eventStore.getEvents('game', aggregateId);

    // how is this performant in a big application?
    // for every action, find all events on the aggregate
    // replay them then do the action.
    // Name change on a aggregate that has 1000 events:
    // Replay all 1000 events, then change the name
    // Next change, again all 1001 events. etc

    // game.loadFromHistory(eventHistory.events);
    // is aggregate with all historic events applied
    // events are applied because methods `on....(EventName)` methods
    // in aggregate

    return game;
  }

  async startNewGame(data: GameDto, uuid: string) {
    const game = new Game(uuid);
    await game.startNewGame(data);

    return game;
  }

  async guessLetter(gameId: string, letter: string) {
    const game = await this.findOneById(gameId);
    await game.guessLetter(letter);
    return game;
  }
}
