import { StorableEvent } from '@peterdijk/nestjs-eventstoredb';

export class LetterGuessedEvent extends StorableEvent {
  eventVersion = 1;

  dateModified: Date;

  constructor(public readonly id: string, public readonly letter: string) {
    super();
    this.dateModified = new Date(); // FIXME: If this is set here, should it not be set in the aggregate root?
  }
}
