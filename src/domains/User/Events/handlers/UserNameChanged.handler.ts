import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CACHE_MANAGER, Inject, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { UserCreatedEvent } from '../UserCreated.event';
import { CACHE_KEYS } from '../../../../infrastructure/constants';
import { UserRepository } from '../../User.repository';
import { UserNameChangedEvent } from '../UserNameChanged.event';

@EventsHandler(UserNameChangedEvent)
export class UserNameChangedEventHandler
  implements IEventHandler<UserNameChangedEvent>
{
  private readonly logger = new Logger(UserNameChangedEventHandler.name);

  constructor(private userRepository: UserRepository) {}

  async handle(event: UserNameChangedEvent) {
    try {
      this.logger.log(`handling event ${event.eventName}`);

      // send websocket
    } catch (err) {
      this.logger.error(`cant save to projection: ${err}`);
    }
  }
}
