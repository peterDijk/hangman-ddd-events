import { StorableEvent } from '@peterdijk/nestjs-eventstoredb';

export class NewGameStartedEvent extends StorableEvent {
  public eventVersion = 1;
  aggregateName = 'game';

  constructor(
    public readonly id: string,
    public readonly playerId: string,
    public readonly wordToGuess: string, // should the type in the event be that of the ValueObject or the string value ?
    public readonly maxGuesses: number,
    public readonly dateCreated: Date,
    public readonly dateModified: Date,
    eventVersion?: number,
  ) {
    super();
    if (eventVersion) {
      this.eventVersion = eventVersion;
    }
  }
}
