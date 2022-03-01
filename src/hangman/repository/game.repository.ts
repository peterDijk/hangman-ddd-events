import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventStore, StoreEventBus } from '@peterdijk/nestjs-eventstoredb';

import { Game } from '../models/game.model';
import { Game as GameProjection } from '../projections/game.entity';

@Injectable()
export class GamesRepository {
  constructor(
    private readonly eventStore: EventStore,
    private readonly eventBus: StoreEventBus,
    @InjectRepository(GameProjection)
    private readonly gamesProjectionRepository: Repository<GameProjection>,
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

  async findAll(): Promise<GameProjection[]> {
    const games = await this.gamesProjectionRepository.find({
      order: { dateModified: 'DESC' },
    });
    return games;
  }
}
