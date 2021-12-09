import { IEvent } from '@nestjs/cqrs';

export class NewGameStartedEvent implements IEvent {
  eventAggregate = 'game';
  eventVersion = 1;

  constructor(
    public readonly game: string, // is actually 'game-{aggregateId}
    public readonly playerId: string,
    public readonly wordToGuess: string,
    public readonly maxGuesses: number,
    public readonly dateCreated: Date,
    public readonly dateModified: Date,
  ) {
    // super();
  }
}
