import { StorableEvent } from '../../Infrastructure/EventStore/Interfaces';

export class LetterGuessedEvent extends StorableEvent {
  eventVersion = 1;

  dateModified: Date;

  constructor(public readonly id: string, public readonly letter: string) {
    super();
    this.dateModified = new Date();
  }
}
