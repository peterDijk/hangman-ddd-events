import { Injectable, Logger } from '@nestjs/common';
import { EventStore, StoreEventBus } from '@peterdijk/nestjs-eventstoredb';

import { Game } from '../models/game.model';

@Injectable()
export class GamesRepository {
  constructor(
    private readonly eventStore: EventStore,
    private readonly eventBus: StoreEventBus,
  ) {}
  private logger = new Logger(GamesRepository.name);

  async findOneById(id: string): Promise<Game> {
    const game = new Game(id);
    const { events } = await this.eventStore.getEvents(
      this.eventBus.streamPrefix,
      id,
    );
    game.loadFromHistory(events);
    return game;
  }
}
