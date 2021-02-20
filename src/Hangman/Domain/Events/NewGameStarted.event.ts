import { IEvent } from '@nestjs/cqrs';

export class NewGameStartedEvent implements IEvent {
  constructor(
    public readonly gameId: string,
    public readonly playerId: string,
    public readonly wordToGuess: string,
    public readonly maxGuesses: number,
  ) {}
}
