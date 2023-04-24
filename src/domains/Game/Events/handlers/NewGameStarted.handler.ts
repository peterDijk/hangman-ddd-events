import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { NewGameStartedEvent } from '../NewGameStarted.event';

@EventsHandler(NewGameStartedEvent)
export class NewGameStartedEventHandler
  implements IEventHandler<NewGameStartedEvent>
{
  private readonly logger = new Logger(NewGameStartedEventHandler.name);

  async handle(event: NewGameStartedEvent) {
    try {
      this.logger.log(`handling event ${event.eventName}`);
      // this.repository.updateOrCreate(game);
      // send websocket
    } catch (err) {
      this.logger.error(`cant save to projection: ${err}`);
    }
  }
}
