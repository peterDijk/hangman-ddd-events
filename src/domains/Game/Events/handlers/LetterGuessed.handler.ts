import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { LetterGuessedEvent } from '../LetterGuessed.event';

@EventsHandler(LetterGuessedEvent)
export class LetterGuessedEventHandler
  implements IEventHandler<LetterGuessedEvent>
{
  private readonly logger = new Logger(LetterGuessedEventHandler.name);

  async handle(event: LetterGuessedEvent) {
    try {
      this.logger.log(`handling event ${event.eventName}`);
      // send websocket
    } catch (err) {
      this.logger.error(`cant save to projection: ${err}`);
    }
  }
}
