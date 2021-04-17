import { AggregateRoot } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import {
  IsString,
  validateOrReject,
  IsNumber,
  MinLength,
  Min,
  IsUUID,
} from 'class-validator';

import { NewGameStartedEvent } from '../Events/NewGameStarted.event';
import { InvalidGameException } from 'src/Hangman/Exceptions';
import { GameDto } from 'src/Hangman/Infrastructure/Dto/Game.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Game extends AggregateRoot {
  @Field((type) => String, { nullable: true })
  @IsUUID()
  gameId: string;

  @Field((type) => String, { nullable: true })
  @IsString()
  @MinLength(2)
  playerId: string;

  @Field((type) => String, { nullable: true })
  @IsString()
  wordToGuess: string;

  @Field((type) => Number, { nullable: true })
  @IsNumber()
  @Min(1)
  maxGuesses: number;

  constructor({ playerId, wordToGuess, maxGuesses }: GameDto) {
    super();
    this.gameId = uuidv4();
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
      throw new InvalidGameException(err);
    }
  }
}
