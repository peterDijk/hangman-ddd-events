import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { LetterGuessedEvent } from '../Events/LetterGuessed.event';

@EventsHandler(LetterGuessedEvent)
export class LetterGuessedEventHandler
  implements IEventHandler<LetterGuessedEvent> {
  private readonly logger = new Logger(LetterGuessedEventHandler.name);

  async handle(event: LetterGuessedEvent) {
    try {
      // send websocket
      this.logger.log(`${JSON.stringify(event)}`);
    } catch (err) {
      this.logger.error('cant save to projection');
    }
  }
}
