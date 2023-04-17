import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { UserRepository } from '../../User.repository';
import { FullNameChangedEvent } from '../FullNameChanged.event';

@EventsHandler(FullNameChangedEvent)
export class FullNameChangedEventHandler
  implements IEventHandler<FullNameChangedEvent>
{
  private readonly logger = new Logger(FullNameChangedEventHandler.name);

  constructor(private userRepository: UserRepository) {}

  async handle(event: FullNameChangedEvent) {
    try {
      this.logger.log(`handling event ${event.eventName}`);

      // send websocket
    } catch (err) {
      this.logger.error(`cant save to projection: ${err}`);
    }
  }
}
