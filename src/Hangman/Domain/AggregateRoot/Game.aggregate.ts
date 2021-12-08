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
import { Logger } from '@nestjs/common';

@ObjectType()
export class Game extends AggregateRoot {
  public readonly id: string;
  public readonly version: number;

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

  // constructor(
  //   { playerId, wordToGuess, maxGuesses, lettersGuessed = [] }: GameDto,
  //   gameId: string,
  // ) {
  //   super();
  //   this.gameId = gameId;
  //   this.playerId = playerId;
  //   this.wordToGuess = wordToGuess;
  //   this.maxGuesses = maxGuesses;
  //   // TODO parse json
  //   this.lettersGuessed = lettersGuessed === null ? [] : lettersGuessed;
  // }
  constructor(id: string, version?: number) {
    super();
    this.id = id;
    this.version = version;
  }

  private logger = new Logger(Game.name);

  async startNewGame(data: GameDto) {
    this.playerId = data.playerId;
    this.wordToGuess = data.wordToGuess;
    this.maxGuesses = data.maxGuesses;
    this.lettersGuessed = [];
    // if we validate here, we can leave validating in CommandConstructor. double validation is unneeded, and here we can async validate using class-validators

    try {
      await validateOrReject(this);

      this.logger.log(this.id);

      const event = new NewGameStartedEvent(
        this.id,
        this.playerId,
        this.wordToGuess,
        this.maxGuesses,
      );

      this.logger.log({ event });

      this.apply(event);
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

    // this.loadFromHistory()
    this.logger.log(this.lettersGuessed);

    this.apply(new LetterGuessedEvent(this.id, this.lettersGuessed));
  }
}
