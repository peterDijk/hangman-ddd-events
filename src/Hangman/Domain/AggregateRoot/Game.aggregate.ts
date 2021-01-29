import { AggregateRoot } from '@nestjs/cqrs';
import {
  IsString,
  validateOrReject,
  IsNumber,
  MinLength,
  Min,
} from 'class-validator';

import { NewGameStartedEvent } from '../Events/NewGameStarted.event';

export class Game extends AggregateRoot {
  @IsString()
  @MinLength(4)
  gameId: string;

  @IsString()
  @MinLength(2)
  playerId: string;

  @IsString()
  wordToGuess: string;

  @IsNumber()
  @Min(1)
  maxGuesses: number;

  constructor(
    gameId: string,
    playerId: string,
    wordToGuess: string,
    maxGuesses: number,
  ) {
    super();
    this.gameId = gameId;
    this.playerId = playerId;
    this.wordToGuess = wordToGuess;
    this.maxGuesses = maxGuesses;
  }

  async startNewGame() {
    // if we validate here, we can leave validating in CommandConstructor. double validation is unneeded, and here we can async validate using class-validators

    try {
      await validateOrReject(this);

      this.apply(
        new NewGameStartedEvent(
          this.gameId,
          this.playerId,
          this.wordToGuess,
          this.maxGuesses,
        ),
      );
    } catch (err) {
      throw new Error('validation error');
    }
  }
}
