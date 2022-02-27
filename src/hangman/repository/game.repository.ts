import { performance, PerformanceObserver } from 'perf_hooks';
import { Injectable, Logger } from '@nestjs/common';
import { GameDto } from '../interfaces/game-dto.interface';
import { Game } from '../models/game.model';
import { EventStore, StoreEventBus } from '@peterdijk/nestjs-eventstoredb';

@Injectable()
export class GamesRepository {
  constructor(
    private readonly eventStore: EventStore,
    private readonly eventBus: StoreEventBus,
  ) {} //
  private logger = new Logger(GamesRepository.name);

  private observer = new PerformanceObserver((items) =>
    items.getEntries().forEach((entry) => this.logger.log(entry)),
  ).observe({ entryTypes: ['measure'] });

  async findOneById(aggregateId: string): Promise<Game> {
    const game = new Game(aggregateId);
    const { events } = await this.eventStore.getEvents(
      this.eventBus.streamPrefix,
      aggregateId,
    );
    game.loadFromHistory(events);
    return game;
  }

  async startNewGame(data: GameDto, uuid: string) {
    const game = new Game(uuid);
    await game.startNewGame(data);

    return game;
  }

  async guessLetter(gameId: string, letter: string) {
    performance.mark('start-guess');

    const game = await this.findOneById(gameId);
    await game.guessLetter(letter);

    performance.mark('stop-guess');
    this.logger.log(`total num guesses: ${game.lettersGuessed.length}`);
    performance.measure('Measurement', 'start-guess', 'stop-guess');

    return game;
  }
}
