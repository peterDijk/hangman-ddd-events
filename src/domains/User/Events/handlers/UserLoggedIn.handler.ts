import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CACHE_MANAGER, Inject, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { UserCreatedEvent } from '../UserCreated.event';
import { CACHE_KEYS } from '../../../../infrastructure/constants';
import { UserLoggedInEvent } from '../UserLoggedIn.event';

@EventsHandler(UserLoggedInEvent)
export class UserLoggedInEventHandler
  implements IEventHandler<UserLoggedInEvent>
{
  private readonly logger = new Logger(UserLoggedInEventHandler.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async handle(event: UserLoggedInEvent) {
    try {
      this.logger.log(`handling event ${event.eventName}`);

      const cacheKeyUserId = `${CACHE_KEYS.CACHE_ID_BY_USERNAME_KEY}-${event.userName}`;
      await this.cacheManager.set(cacheKeyUserId, event.id, 3600 * 60);
      // send websocket
    } catch (err) {
      this.logger.error(`cant save to projection: ${err}`);
    }
  }
}
