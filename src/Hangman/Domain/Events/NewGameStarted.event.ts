import { StorableEvent } from '@peterdijk/nestjs-eventstoredb';

export class NewGameStartedEvent extends StorableEvent {
  constructor(
    public readonly id: string,
    public readonly playerId: string,
    public readonly wordToGuess: string,
    public readonly maxGuesses: number,
    public readonly dateCreated: Date,
    public readonly dateModified: Date,
    public readonly eventVersion: number,
  ) {
    super();
  }
}
