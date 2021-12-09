import { IEvent } from '@nestjs/cqrs';

export class LetterGuessedEvent implements IEvent {
  eventAggregate = 'game';
  eventVersion = 1;

  constructor(
    public readonly game: string,
    public readonly letter: string,
    public readonly lettersGuessed: string[],
  ) {
    // super();
  }
}
