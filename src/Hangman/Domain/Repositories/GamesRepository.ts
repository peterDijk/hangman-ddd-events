import { Injectable, Logger } from '@nestjs/common';
import { GameDto } from '../../Infrastructure/Dto/Game.dto';
import { Game } from '../AggregateRoot/Game.aggregate';
import { EventStore } from '@berniemac/event-sourcing-nestjs';

@Injectable()
export class GamesRepository {
  constructor(private readonly eventStore: EventStore) {}
  private logger = new Logger(GamesRepository.name);

  async findOneById(aggregateId: string): Promise<Game> {
    const game = new Game(aggregateId);
    const eventHistory = await this.eventStore.getEvents('game', aggregateId);

    // how performant is getting events for id xx in a big application?
    // try with setting maxGuesses to 100.000 and let locust make 99.000 guesses.
    // does making a guess request start to take a lot longer?

    game.loadFromHistory(eventHistory.events);

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
