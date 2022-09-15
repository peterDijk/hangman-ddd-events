import { StorableEvent } from '@peterdijk/nestjs-eventstoredb';

export class LetterGuessedEvent extends StorableEvent {
  aggregateName = 'game';
  public eventVersion = 1;

  constructor(
    public readonly id: string,
    public readonly letter: string,
    public readonly dateModified: Date,
    eventVersion?: number,
  ) {
    super();
    if (eventVersion) {
      this.eventVersion = eventVersion;
    }
  }
}
