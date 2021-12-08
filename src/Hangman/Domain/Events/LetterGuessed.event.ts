import { StorableEvent } from '@berniemac/event-sourcing-nestjs';
import { IEvent } from '@nestjs/cqrs';

export class LetterGuessedEvent extends StorableEvent {
  eventAggregate: 'game';
  eventVersion: 1;

  constructor(
    public readonly id: string,
    public readonly lettersGuessed: string[],
  ) {
    super();
  }
}
