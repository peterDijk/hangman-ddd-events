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
import { InvalidGameException } from '../../Exceptions';
import { GameDto } from '../../Infrastructure/Dto/Game.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Game extends AggregateRoot {
  @Field()
  @IsUUID()
  gameId: string;

  @Field()
  @IsString()
  @MinLength(2)
  playerId: string;

  @Field()
  @IsString()
  @MinLength(5)
  wordToGuess: string;

  @Field()
  @IsNumber()
  @Min(1)
  maxGuesses: number;

  constructor({ playerId, wordToGuess, maxGuesses }: GameDto, gameId: string) {
    super();
    this.gameId = gameId; //uuidv4();
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
