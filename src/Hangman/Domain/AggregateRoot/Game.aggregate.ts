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

  @Field((type) => [String])
  lettersGuessed: string[];

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

    try {
      await validateOrReject(this);

      this.logger.log(this.id);

      this.apply(
        new NewGameStartedEvent(
          this.id,
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
    this.apply(new LetterGuessedEvent(this.id, letter, this.lettersGuessed));
  }

  // Replay event from history `loadFromHistory` function calls
  // onNameOfEvent
  onNewGameStartedEvent(event: NewGameStartedEvent) {
    this.logger.log(`replaying from history: ${event}`);
    this.playerId = event.playerId;
    this.wordToGuess = event.wordToGuess;
    this.maxGuesses = event.maxGuesses;
    this.lettersGuessed = [];
  }

  onLetterGuessedEvent(event: LetterGuessedEvent) {
    this.logger.log(`replaying from history: ${event}`);
    this.lettersGuessed.push(event.letter[0]);
  }
}
