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

  constructor(
    private readonly eventStore: EventStore,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  private logger = new Logger(UserRepository.name);

  async updateOrCreate(user: User): Promise<void> {
    const cacheKey = this.getCacheKey({ userId: user.id });
    const serializedUser = JSON.stringify(instanceToPlain(user)); // during instanceToPlain applied events get published ?
    this.logger.debug(serializedUser);

    // disabling this because getting the object from cache doesnt
    // give a complete Aggregate at the moment
    await this.cacheManager.set(cacheKey, serializedUser, 3600 * 60);
    this.logger.debug(`set User in cache`);

    await this.cacheManager.set(
      this.getCacheKey({ username: user.userName.value }),
      user.id,
      3600 * 60,
    );
    this.logger.debug(`set username:userId pair in cache`);
  }

  async findOneById(aggregateId: string): Promise<User> {
    let userFromCache: string = null;
    // const userFromCache = (await this.cacheManager.get(
    //   this.getCacheKey({ userId: aggregateId }),
    // )) as string;

    // TODO: commented out because the object we recreate from the
    // cache is not a complete working Aggregate, it doesn't have
    // working methods.
    // Find a way to retrieve the Aggregate and instanciate
    // incl all past events on it, so that we don't always have
    // to rebuild the Aggregate from all past events for every action

    if (userFromCache) {
      const deserializedUser = plainToInstance(User, JSON.parse(userFromCache));

      this.logger.debug(`returing User from cache`);
      return deserializedUser;
    } else {
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
    }
  }

  async findOneByUsername(username: string): Promise<User> {
    try {
      const userId = await this.findUserIdFromCacheOrEvents(username);

      if (userId) {
        // comes from either cache or events
        const user = await this.findOneById(userId);

        return user;
      } else {
        // throw new BadRequestException('no userid to work with');
      }
    } catch (err) {
      this.logger.error(err);
      // throw new BadRequestException('no user found with username');
    }
  }

  async findUserIdFromCacheOrEvents(username: string): Promise<string> {
    const cacheKey = this.getCacheKey({ username });
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
      }

      return userId;
    }

    this.logger.debug(`found id for user in cache`);
    return userId;
  }

  getCacheKey({ username, userId }: { username?: string; userId?: string }) {
    if (username) {
      return `${CACHE_KEYS.CACHE_ID_BY_USERNAME_KEY}-${username}`;
    }

    if (userId) {
      return `${CACHE_KEYS.AGGREGATE_KEY}-${userId}`;
    }
  }
}
