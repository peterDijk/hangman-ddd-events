import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { User } from './User.aggregate';
import { EventStore } from '@peterdijk/nestjs-eventstoredb';
import { Repository } from 'typeorm';
import { User as UserProjection } from '../../infrastructure/read-models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_KEYS } from '../../infrastructure/constants';
import { UserCreatedEvent } from './Events/UserCreated.event';

@Injectable()
export class UserRepository {
  private readonly aggregate = 'user';

  constructor(
    private readonly eventStore: EventStore,
    @InjectRepository(UserProjection)
    private userProjectionRepository: Repository<UserProjection>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  private logger = new Logger(UserRepository.name);

  async findOneById(aggregateId: string): Promise<User> {
    const user = new User(aggregateId);
    const { events } = await this.eventStore.getEvents(
      this.aggregate,
      aggregateId,
    );
    user.loadFromHistory(events);
    return user;
  }

  async findUserIdFromCacheOrEvents(username: string): Promise<string> {
    const cacheKey = `${CACHE_KEYS.CACHE_ID_BY_USERNAME_KEY}-${username}`;
    let userId: string = await this.cacheManager.get(cacheKey);

    if (!userId) {
      this.logger.debug(
        `couldn't find userId in cache (cacheKey: ${cacheKey})`,
      );

      // rebuild cache from eventstore ?
      // - find key:value by property in all events from stream
      // - get all events for stream 'user'
      // - build aggregates
      // - for each aggregate, write the username: id pair to the cache

      const eventId = (await this.eventStore.getPropertyByKeyValueFromStream(
        'user',
        UserCreatedEvent.name,
        'userName',
        username,
        'id',
      )) as string;

      if (eventId) {
        this.logger.debug(`found id in events: ${eventId}`);
        userId = eventId;

        this.cacheManager.set(cacheKey, userId);
      }

      return userId;
    }

    return userId;
  }

  async findOneByUsername(username: string): Promise<User> {
    try {
      const userId = await this.findUserIdFromCacheOrEvents(username);
      // @leon what is best strategy? get aggregate from cache, or build up aggregate from eventstore?

      // const user: User = await this.cacheManager.get(
      //   `${CACHE_KEYS.AGGREGATE_KEY}-user-${userId}`,
      // );

      if (userId) {
        const user = new User(userId);

        const { events } = await this.eventStore.getEvents(
          this.aggregate,
          userId,
        );

        user.loadFromHistory(events);

        return user;
      } else {
        throw new BadRequestException('no userid to work with');
      }
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException('no user found with username');
    }
  }
}
