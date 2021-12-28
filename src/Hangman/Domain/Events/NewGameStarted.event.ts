import { StorableEvent } from '../../Infrastructure/EventStore/Interfaces';

export class NewGameStartedEvent extends StorableEvent {
  eventVersion = 1;

  constructor(
    public readonly id: string,
    public readonly playerId: string,
    public readonly wordToGuess: string,
    public readonly maxGuesses: number,
    public readonly dateCreated: Date,
    public readonly dateModified: Date,
  ) {
    super();
  }
}
