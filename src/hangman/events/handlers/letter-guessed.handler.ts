import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { LetterGuessedEvent } from '../impl/letter-guessed.event';
import { LetterGuessedUpdater } from '../updaters/letter-guessed.updater';

@EventsHandler(LetterGuessedEvent)
export class LetterGuessedHandler implements IEventHandler<LetterGuessedEvent> {
  constructor(private readonly viewUpdater: LetterGuessedUpdater) {}
  private readonly logger = new Logger(LetterGuessedHandler.name);

  async handle(event: LetterGuessedEvent) {
    try {
      await this.viewUpdater.handle(event);
      // send websocket
    } catch (err) {
      this.logger.error(`cant save to projection: ${err}`);
    }
  }
}
