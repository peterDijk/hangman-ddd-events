import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Game } from './Game.aggregate';
import { EventStore } from '@peterdijk/nestjs-eventstoredb';
import { CACHE_KEYS } from '../../infrastructure/constants';
import { instanceToPlain, plainToInstance } from 'class-transformer';

@Injectable()
export class GamesRepository {
  private readonly aggregate = 'game';

  constructor(
    private readonly eventStore: EventStore,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  private logger = new Logger(GamesRepository.name);

  async updateOrCreate(game: Game): Promise<void> {
    const cacheKey = this.getCacheKey(game.id);
    const serializedGame = JSON.stringify(instanceToPlain(game));
    // return this.cacheManager.set(cacheKey, serializedGame);
  }

  async findOneById(aggregateId: string): Promise<Game> {
    const gameFromCache = (await this.cacheManager.get(
      this.getCacheKey(aggregateId),
    )) as string;

    if (gameFromCache) {
      const deserializedGame = plainToInstance(Game, JSON.parse(gameFromCache));

      this.logger.debug(`returing Game from cache`);
      return deserializedGame;
    } else {
      const game = new Game(aggregateId);
      const { events } = await this.eventStore.getEventsForAggregate(
        this.aggregate,
        aggregateId,
      );
      game.loadFromHistory(events);
      this.updateOrCreate(game);
      this.logger.debug(`returning rebuilt Game from events`);
      return game;
    }
  }

  getCacheKey(gameId: string) {
    return `${CACHE_KEYS.AGGREGATE_KEY}-game-${gameId}`;
  }
}
