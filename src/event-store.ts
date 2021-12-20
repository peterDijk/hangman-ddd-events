import { LetterGuessedEvent } from './Hangman/Domain/Events/LetterGuessed.event';
import { NewGameStartedEvent } from './Hangman/Domain/Events/NewGameStarted.event';

export const EventStoreInstanciators = {
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
