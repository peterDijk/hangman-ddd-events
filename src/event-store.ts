import { LetterGuessedEvent } from './Hangman/Domain/Events/LetterGuessed.event';
import { NewGameStartedEvent } from './Hangman/Domain/Events/NewGameStarted.event';

export const EventStoreInstanciators = {
  NewGameStartedEvent: (gameId, playerId, wordToGuess, maxGuesses) => {
    //  WHY IS GAMEID HERE DIFFERENT FROM GAMEID ATTR IN EVENTSTORE EVENT
    console.log('NewGameStartedEvent from eventstore', { gameId });
    /* 
    Note: if your event broker type is Event Store then featureStreamName should look like '$ce-user', then you should name your domain argument should be user without $ce, for example.

export class UserCreatedEvent implements IEvent {
    constructor(
        public readonly user: any // This what im talking about.
    )  { }
}
The way this works is we group the event based the first argument in the constructor name and this argument name must be a substring of featureStreamName. I'm sorry you can't pass you your own unique name at the moment, but I will add support for it
     *
     * DOES THE ID CHANGE HERE. ITS NOT THE OBJECT OF THE EVENT
     * THEY ARE EACH PASSED AS PARAMETERS
     */
    return new NewGameStartedEvent(gameId, playerId, wordToGuess, maxGuesses);
  },
  LetterGuessedEvent: (gameId, letter) => {
    return new LetterGuessedEvent(gameId, letter);
  },
};
