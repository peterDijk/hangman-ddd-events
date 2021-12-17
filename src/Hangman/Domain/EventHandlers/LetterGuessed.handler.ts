import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { LetterGuessedEvent } from '../Events/LetterGuessed.event';
import { LetterGuessedUpdater } from '../Updaters/LetterGuessed.updater';

@EventsHandler(LetterGuessedEvent)
export class LetterGuessedEventHandler
  implements IEventHandler<LetterGuessedEvent> {
  constructor(private readonly viewUpdater: LetterGuessedUpdater) {}
  private readonly logger = new Logger(LetterGuessedEventHandler.name);

  async handle(event: LetterGuessedEvent) {
    try {
      await this.viewUpdater.handle(event);
      // send websocket

      this.logger.log(`${JSON.stringify(event)}`);
    } catch (err) {
      this.logger.error(`cant save to projection: ${err}`);
    }
  }
}
