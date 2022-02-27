import { LetterGuessedEvent } from './letter-guessed.event';
import { NewGameStartedEvent } from './new-game-started.event';

// What does this do?
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
