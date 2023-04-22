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
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { CACHE_KEYS } from '../../infrastructure/constants';
import { UserCreatedEvent } from './Events/UserCreated.event';

@Injectable()
export class UserRepository {
  private readonly aggregate = 'user';
  private instances = new Map<string, User>();
  private userNameIds = new Map<string, string>();

  constructor(
    private readonly eventStore: EventStore,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  private logger = new Logger(UserRepository.name);

  async updateOrCreate(user: User): Promise<void> {
    const cacheKey = this.getCacheKey({ userId: user.id });
    this.instances.set(cacheKey, user);

    // const serializedUser = instanceToPlain(user);
    // await this.cacheManager.set(cacheKey, serializedUser);
    this.logger.debug(`set User in cache`);

    // await this.cacheManager.set(
    //   this.getCacheKey({ username: user.userName.value }),
    //   user.id,
    // );
    this.userNameIds.set(user.userName.value, user.id);
    this.logger.debug(`set username:userId pair in cache`);
  }

  async findOneById(aggregateId: string): Promise<User> {
    // const userFromCache = (await this.cacheManager.get(
    //   this.getCacheKey({ userId: aggregateId }),
    // )) as string;

    const userFromCache = this.instances.get(
      this.getCacheKey({ userId: aggregateId }),
    );

    if (userFromCache) {
      // const deserializedUser = plainToInstance(User, userFromCache);

      this.logger.debug(`returing User from cache`);
      return userFromCache;
    } else {
      try {
        // build up aggregate from all past aggregate events
        const user = new User(aggregateId);
        const { events } = await this.eventStore.getEventsForAggregate(
          this.aggregate,
          aggregateId,
        );

        user.loadFromHistory(events);
        this.updateOrCreate(user);
        this.logger.debug(`returning rebuilt User from events`);
        return user;
      } catch (err) {
        this.logger.error(err);
      }
    }
  }

  async findOneByUsername(username: string): Promise<User> {
    const userId = await this.findUserIdFromCacheOrEvents(username);

    if (userId) {
      // comes from either cache or events
      const user = await this.findOneById(userId);

      return user;
    }
  }

  async findUserIdFromCacheOrEvents(username: string): Promise<string> {
    const cacheKey = this.getCacheKey({ username });
    // let userId: string = await this.cacheManager.get(cacheKey);
    let userId: string = this.userNameIds.get(username);

    if (!userId) {
      this.logger.debug(
        `couldn't find userId in cache (cacheKey: ${cacheKey}). Replaying events to find id and update cache`,
      );

      // rebuild cache from eventstore
      // - find key:value by property in all events from stream
      // - get all events for event type stream 'UserCreatedEvent' and find the user id for username
      // - write the username: id pair to the cache
      // - return user id

      try {
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
        }

        return userId;
      } catch (error) {
        this.logger.error(error);
        return;
      }
    }

    this.logger.debug(`found id for user in cache`);
    return userId;
  }

  getCacheKey({ username, userId }: { username?: string; userId?: string }) {
    if (username) {
      return `${CACHE_KEYS.CACHE_ID_BY_USERNAME}-${username}`;
    }

    if (userId) {
      return `${CACHE_KEYS.AGGREGATE}-User-${userId}`;
    }
  }
}
