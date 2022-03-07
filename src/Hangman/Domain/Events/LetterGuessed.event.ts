import { StorableEvent } from '@peterdijk/nestjs-eventstoredb';

export class LetterGuessedEvent extends StorableEvent {
  constructor(
    public readonly id: string,
    public readonly letter: string,
    public readonly dateModified: Date,
    public readonly eventVersion: number,
  ) {
    super();
  }
}
