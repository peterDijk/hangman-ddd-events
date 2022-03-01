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
  }) => {
    return new NewGameStartedEvent(
      id,
      playerId,
      wordToGuess,
      maxGuesses,
      dateCreated,
      dateModified,
    );
  },
  LetterGuessedEvent: ({ id, letter }) => {
    return new LetterGuessedEvent(id, letter);
  },
};
