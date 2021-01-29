import { AggregateRoot } from '@nestjs/cqrs';
import { NewGameStartedEvent } from '../Events/NewGameStarted.event';

export class Game extends AggregateRoot {
  constructor(
    private readonly gameId: string,
    public playerId: string,
    public wordToGuess: string,
    public maxGuesses: number,
  ) {
    super();
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
