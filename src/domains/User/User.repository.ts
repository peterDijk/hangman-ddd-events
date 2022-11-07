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
    const { events } = await this.eventStore.getEventsForAggregate(
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
        `couldn't find userId in cache (cacheKey: ${cacheKey}). Replaying events to find id and update cache`,
      );

      // rebuild cache from eventstore
      // - find key:value by property in all events from stream
      // - get all events for event type stream 'UserCreatedEvent' and find the user id for username
      // - write the username: id pair to the cache
      // - return user id

      const eventId = (await this.eventStore.getPropertyByKeyValueFromEvents({
        streamPrefix: 'user',
        searchEventName: UserCreatedEvent.name,
        searchProperty: 'userName',
        searchValue: username,
        requestProperty: 'id',
      })) as string;

      if (eventId) {
        this.logger.debug(`found id in events: ${eventId}`);
        userId = eventId;

        this.cacheManager.set(cacheKey, userId, 3600 * 60);
        this.logger.debug(`set username:userId pair in cache`);
      }

      return userId;
    }

    return userId;
  }

  async findOneByUsername(username: string): Promise<User> {
    try {
      const userId = await this.findUserIdFromCacheOrEvents(username);

      if (userId) {
        const user = new User(userId);

        // @leon what is best strategy? get aggregate from cache, or build up aggregate from eventstore?
        const { events } = await this.eventStore.getEventsForAggregate(
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
