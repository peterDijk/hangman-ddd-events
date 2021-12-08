import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameDto } from '../../Infrastructure/Dto/Game.dto';
import { Game } from '../AggregateRoot/Game.aggregate';

import { Game as GameProjection } from '../../ReadModels/game.entity';
import { Repository } from 'typeorm';
import { EventStore } from '@berniemac/event-sourcing-nestjs';

@Injectable()
export class GamesRepository {
  constructor(private readonly eventStore: EventStore) {}
  private logger = new Logger(GamesRepository.name);

  async findOneById(aggregateId: string): Promise<Game> {
    const game = new Game(aggregateId);
    game.loadFromHistory(
      await (await this.eventStore.getEvents('game', aggregateId)).events,
    );
    // const game = await this.gamesProjectionRepository.findOne(aggregateId);
    this.logger.log(`find One ${JSON.stringify(game)}`);

    return game;
  }

  // https://www.npmjs.com/package/@berniemac/event-sourcing-nestjs the solution
  //
  // async _findOneById(id: string): Promise<Game> {
  //   const game = new Game({}, id);
  //   game.loadFromHistory(await this.eventStore.getEvents('game', id));
  //   return game;
  // }

  async startNewGameRep(data: GameDto, uuid: string) {
    const game = new Game(uuid);
    await game.startNewGame(data);

    return game;
  }

  async guessLetterRep(gameId: string, letter: string) {
    const game = await this.findOneById(gameId);
    // find game in repository, make a new Game from it
    // so it is a Aggregate with methods and properties again

    // better solution then find in projection-db ?
    // query event store ?
    // redis?

    await game.guessLetter(letter);
    return game;
  }
}
