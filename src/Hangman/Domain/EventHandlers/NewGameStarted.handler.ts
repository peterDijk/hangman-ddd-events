import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NewGameStartedEvent } from '../Events/NewGameStarted.event';
import { Logger } from '@nestjs/common';

@EventsHandler(NewGameStartedEvent)
export class NewGameStartedHandler
  implements IEventHandler<NewGameStartedEvent> {
  handle(event: NewGameStartedEvent) {
    Logger.log(event, 'new game started event');
  }
}
