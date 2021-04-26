import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NewGameStartedEvent } from '../Events/NewGameStarted.event';
import { Logger } from '@nestjs/common';

@EventsHandler(NewGameStartedEvent)
export class NewGameStartedEventHandler
  implements IEventHandler<NewGameStartedEvent> {
  private readonly logger = new Logger(NewGameStartedEventHandler.name);

  handle(event: NewGameStartedEvent) {
    // write to projection database?
    // this.logger.log(event);
  }
}
