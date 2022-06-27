import { StorableEvent } from '@peterdijk/nestjs-eventstoredb';

export class LetterGuessedEvent extends StorableEvent {
  public readonly eventVersion = 1;
  aggregateName = 'game';

  constructor(
    public readonly id: string,
    public readonly letter: string,
    public readonly dateModified: Date,
  ) {
    super();
  }
}
