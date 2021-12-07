import { LetterGuessedEvent } from './Hangman/Domain/Events/LetterGuessed.event';
import { NewGameStartedEvent } from './Hangman/Domain/Events/NewGameStarted.event';

export const EventStoreInstanciators = {
  NewGameStartedEvent: (gameId, playerId, wordToGuess, maxGuesses) => {
    return new NewGameStartedEvent(gameId, playerId, wordToGuess, maxGuesses);
  },
  LetterGuessedEvent: (gameId, letter) => {
    return new LetterGuessedEvent(gameId, letter);
  },
};
