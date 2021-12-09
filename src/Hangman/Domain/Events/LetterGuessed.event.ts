import { StorableEvent } from '@berniemac/event-sourcing-nestjs';

export class LetterGuessedEvent extends StorableEvent {
  eventAggregate = 'game';
  eventVersion = 1;

  constructor(
    public readonly id: string,
    public readonly letter: string,
    public readonly lettersGuessed: string[],
  ) {
    super();
  }
}
