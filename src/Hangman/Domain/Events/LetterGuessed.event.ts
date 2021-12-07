import { IEvent } from '@nestjs/cqrs';

export class LetterGuessedEvent implements IEvent {
  constructor(
    public readonly gameId: string,
    public readonly lettersGuessed: string[],
  ) {}
}
