import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NewGameStartedEvent } from '../Events/NewGameStarted.event';
import { Logger } from '@nestjs/common';

@EventsHandler(NewGameStartedEvent)
export class NewGameStartedEventHandler
  implements IEventHandler<NewGameStartedEvent> {
  private readonly logger = new Logger(NewGameStartedEventHandler.name);

  async handle(event: NewGameStartedEvent) {
    try {
      this.logger.log(`handling event ${event.eventName}`);
      // send websocket
    } catch (err) {
      this.logger.error(`cant save to projection: ${err}`);
    }
  }
}
