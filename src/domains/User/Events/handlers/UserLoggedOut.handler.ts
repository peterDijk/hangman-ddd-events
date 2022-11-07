import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CACHE_MANAGER, Inject, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { UserCreatedEvent } from '../UserCreated.event';
import { CACHE_KEYS } from '../../../../infrastructure/constants';
import { UserLoggedInEvent } from '../UserLoggedIn.event';
import { UserLoggedOutEvent } from '../UserLoggedOut.event';

@EventsHandler(UserLoggedOutEvent)
export class UserLoggedOutEventHandler
  implements IEventHandler<UserLoggedOutEvent>
{
  private readonly logger = new Logger(UserLoggedOutEventHandler.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async handle(event: UserLoggedOutEvent) {
    try {
      this.logger.log(`handling event ${event.eventName}`);

      // send websocket
    } catch (err) {
      this.logger.error(`cant save to projection: ${err}`);
    }
  }
}
