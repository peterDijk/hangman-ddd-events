import { StorableEvent } from '@berniemac/event-sourcing-nestjs';

export class NewGameStartedEvent extends StorableEvent {
  eventAggregate = 'game';
  eventVersion = 1;

  constructor(
    public readonly id: string,
    public readonly playerId: string,
    public readonly wordToGuess: string,
    public readonly maxGuesses: number,
    public readonly dateCreated: Date,
    public readonly dateModified: Date, // public readonly lettersGuessed: string[],
  ) {
    super();
  }
}
