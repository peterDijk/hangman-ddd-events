import { AggregateRoot } from '@nestjs/cqrs';
import { NewGameStartedEvent } from '../Events/NewGameStarted.event';

export class Game extends AggregateRoot {
  playerId: string;
  wordToGuess: string;
  maxGuesses: number;

  constructor(private readonly gameId: string) {
    super();
  }

  setData(playerId: string, wordToGuess: string, maxGuesses: number) {
    this.playerId = playerId;
    this.wordToGuess = wordToGuess;
    this.maxGuesses = maxGuesses;
  }

  startNewGame() {
    this.apply(
      new NewGameStartedEvent(
        this.gameId,
        this.playerId,
        this.wordToGuess,
        this.maxGuesses,
      ),
    );
  }
}
