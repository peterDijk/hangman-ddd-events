import { performance, PerformanceObserver } from 'perf_hooks';
import { Injectable, Logger } from '@nestjs/common';
import { GameDto } from '../../Infrastructure/Dto/Game.dto';
import { Game } from '../AggregateRoot/Game.aggregate';
import { EventStore } from '../../Infrastructure/EventStore/EventStore';
import { StoreEventBus } from '../../Infrastructure/EventStore/EventBus';

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
