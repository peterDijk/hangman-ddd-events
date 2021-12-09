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

  dateCreated: Date;
  dateModified: Date;

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
    this.dateCreated = new Date();
    this.dateModified = new Date();

    try {
      await validateOrReject(this);

      this.logger.log(this.id);

      this.apply(
        new NewGameStartedEvent(
          this.id,
          this.playerId,
          this.wordToGuess,
          this.maxGuesses,
          this.dateCreated,
          this.dateModified,
        ),
      );
    } catch (err) {
      throw new InvalidGameException(err);
    }
  }

  async guessLetter(letter: string) {
    // TODO: validate guess

    // better validation of course, quick check to see if this works
    this.lettersGuessed.push(letter[0]);
    this.logger.log(
      `this.lettersGuessed?.length: ${this.lettersGuessed?.length}`,
    );
    if (this.lettersGuessed?.length >= this.maxGuesses) {
      throw new InvalidGameException('Max guesses, game over');
    }
    this.apply(new LetterGuessedEvent(this.id, letter, this.lettersGuessed));
  }

  // Replay event from history `loadFromHistory` function calls
  // onNameOfEvent
  // framework magic
  onNewGameStartedEvent(event: NewGameStartedEvent) {
    this.logger.log(`replaying from history: ${event.id}`);
    this.playerId = event.playerId;
    this.wordToGuess = event.wordToGuess;
    this.maxGuesses = event.maxGuesses;
    this.lettersGuessed = [];
  }

  onLetterGuessedEvent(event: LetterGuessedEvent) {
    this.logger.log(`replaying from history: ${event.id}`);
    this.lettersGuessed.push(event.letter[0]);
  }
}
