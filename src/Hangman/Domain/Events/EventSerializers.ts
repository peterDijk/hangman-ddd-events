import { LetterGuessedEvent } from './LetterGuessed.event';
import { NewGameStartedEvent } from './NewGameStarted.event';

export const EventSerializers = {
  NewGameStartedEvent: ({
    id,
    playerId,
    wordToGuess,
    maxGuesses,
    dateCreated,
    dateModified,
    eventVersion,
  }) => {
    return new NewGameStartedEvent(
      id,
      playerId,
      wordToGuess,
      maxGuesses,
      dateCreated,
      dateModified,
      eventVersion,
    );
  },
  LetterGuessedEvent: ({ id, letter, dateModified, eventVersion }) => {
    return new LetterGuessedEvent(id, letter, dateModified, eventVersion);
  },
};
