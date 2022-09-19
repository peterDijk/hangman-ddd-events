import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { UserCreatedEvent } from '../UserCreated.event';

@EventsHandler(UserCreatedEvent)
export class UserCreatedEventEventHandler
  implements IEventHandler<UserCreatedEvent>
{
  private readonly logger = new Logger(UserCreatedEventEventHandler.name);

  async handle(event: UserCreatedEvent) {
    try {
      this.logger.log(`handling event ${event.eventName}`);
      // send websocket
    } catch (err) {
      this.logger.error(`cant save to projection: ${err}`);
    }
  }
}
