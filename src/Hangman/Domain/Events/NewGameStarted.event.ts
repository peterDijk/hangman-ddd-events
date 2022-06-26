import { StorableEvent } from '@peterdijk/nestjs-eventstoredb';
import { MaxGuesses } from '../ValueObjects/MaxGuesses.value-object';
import { Word } from '../ValueObjects/Word.value-object';

export class NewGameStartedEvent extends StorableEvent {
  public eventVersion = 1;
  /* Changelog
   * v2: wordToGuess and maxGuesses are value objects

  */

  constructor(
    public readonly id: string,
    public readonly playerId: string,
    public readonly wordToGuess: string, // should the type in the event be that of the ValueObject or the string value ?
    public readonly maxGuesses: number,
    public readonly dateCreated: Date,
    public readonly dateModified: Date,
    eventVersion?: number,
  ) {
    super();
    if (eventVersion) {
      this.eventVersion = eventVersion;
    }
  }
}
