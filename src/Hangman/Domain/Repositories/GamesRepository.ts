import { Injectable, Logger } from '@nestjs/common';
import { Game } from '../AggregateRoot/Game.aggregate';
import { EventStore, StoreEventBus } from '@peterdijk/nestjs-eventstoredb';

@Injectable()
export class GamesRepository {
  private readonly aggregate = 'game';

  constructor(
    private readonly eventStore: EventStore,
    private readonly eventBus: StoreEventBus,
  ) {}
  private logger = new Logger(GamesRepository.name);

  async findOneById(aggregateId: string): Promise<Game> {
    const game = new Game(aggregateId);
    const { events } = await this.eventStore.getEvents(
      this.aggregate,
      aggregateId,
    );
    game.loadFromHistory(events);
    return game;
  }
}
