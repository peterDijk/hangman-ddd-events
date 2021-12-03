import { NewGameStartedEvent } from './Hangman/Domain/Events/NewGameStarted.event';

export const EventStoreInstanciators = {
  NewGameStartedEvent: (gameId, playerId, wordToGuess, maxGuesses) => {
    return new NewGameStartedEvent(gameId, playerId, wordToGuess, maxGuesses);
  },
};
