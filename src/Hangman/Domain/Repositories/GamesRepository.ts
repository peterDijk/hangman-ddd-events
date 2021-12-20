import { Injectable, Logger } from '@nestjs/common';
import { GameDto } from '../../Infrastructure/Dto/Game.dto';
import { Game } from '../AggregateRoot/Game.aggregate';
// import { EventStore } from '@berniemac/event-sourcing-nestjs';
import { EventStoreDBClient } from '@eventstore/db-client';
import { EventStoreInstanciators } from '../../../event-store';
import { EventStore } from '../../Infrastructure/EventStore/EventStore';

@Injectable()
export class GamesRepository {
  constructor(private readonly eventStore: EventStore) {} //
  private logger = new Logger(GamesRepository.name);

  async findOneById(aggregateId: string): Promise<Game> {
    const game = new Game(aggregateId);
    const { events } = await this.eventStore.getEvents('game', aggregateId);
    game.loadFromHistory(events);
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
