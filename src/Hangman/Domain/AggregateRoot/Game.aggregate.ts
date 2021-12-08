import { AggregateRoot } from '@nestjs/cqrs';
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
import { LetterGuessedEvent } from '../Events/LetterGuessed.event';

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
  @MinLength(3)
  wordToGuess: string;

  @Field()
  @IsNumber()
  @Min(1)
  maxGuesses: number;

  @Field()
  lettersGuessed: string[];

  constructor(
    { playerId, wordToGuess, maxGuesses, lettersGuessed }: GameDto,
    gameId: string,
  ) {
    super();
    this.gameId = gameId;
    this.playerId = playerId;
    this.wordToGuess = wordToGuess;
    this.maxGuesses = maxGuesses;
    // TODO parse json
    this.lettersGuessed = [];
  }

  async startNewGame() {
    // if we validate here, we can leave validating in CommandConstructor. double validation is unneeded, and here we can async validate using class-validators

    try {
      await validateOrReject(this);

      this.apply(
        new NewGameStartedEvent(
          'game',
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

  async guessLetter(letter: string) {
    // TODO: validate guess
    const gameOver = true;
    // better validation of course, quick check to see if this works

    if (this.lettersGuessed?.length - 1 === this.maxGuesses && gameOver) {
      throw new InvalidGameException('max guesses looser');
    }

    this.lettersGuessed.push(letter[0]);

    this.apply(new LetterGuessedEvent(this.gameId, this.lettersGuessed));
  }
}
