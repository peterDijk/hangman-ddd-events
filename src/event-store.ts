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
    console.log('NewGameStartedEvent from eventstore', { id });

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
    console.log(`LetterGuessedEvent from eventstore`, { id });
    return new LetterGuessedEvent(id, letter);
  },
};
