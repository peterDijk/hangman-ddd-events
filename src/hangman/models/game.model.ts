import { AggregateRoot } from '@nestjs/cqrs';
import { Field, ObjectType } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import {
  IsString,
  validateOrReject,
  IsNumber,
  MinLength,
  Min,
  IsUUID,
} from 'class-validator';

import { NewGameStartedEvent } from '../events/impl/new-game-started.event';
import { LetterGuessedEvent } from '../events/impl/letter-guessed.event';
import { InvalidGameException } from '../exceptions';
import { GameDto } from '../interfaces/game-dto.interface';

@ObjectType()
export class Game extends AggregateRoot {
  @IsUUID()
  public readonly id: string;

  // @IsNumber() // FIXME - caused validation error
  private readonly version: number;

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
    this.lettersGuessed = [];
  }

  private logger = new Logger(Game.name);

  async startNewGame(data: GameDto) {
    // apply to be able to validate
    this.playerId = data.playerId;
    this.wordToGuess = data.wordToGuess;
    this.maxGuesses = data.maxGuesses;
    // this.lettersGuessed = []; // Moved this initilization to the constructor
    this.dateCreated = new Date();
    this.dateModified = new Date();

    try {
      // Does this need to be async with await? Can this entire method be made sync?
      await validateOrReject(this); // Should you validate "this", or data (the DTO)?

      this.apply(
        new NewGameStartedEvent(
          this.id,
          this.playerId,
          this.wordToGuess,
          this.maxGuesses,
          this.dateCreated,
          this.dateModified,
        ),
        false,
      );
    } catch (err) {
      // TODO: Is try/catch needed? Does validateOrReject throw an error already if it fails?
      throw new InvalidGameException(err);
    }
  }

  async guessLetter(letter: string) {
    // TODO: validate guess

    // better validation of course, quick check to see if this works

    const newLettersGuessed = [...this.lettersGuessed, letter];

    if (newLettersGuessed.length >= this.maxGuesses) {
      throw new InvalidGameException('Max guesses, game over');
    }

    const event = new LetterGuessedEvent(this.id, letter);

    this.apply(event, false);
  }

  // Replay event from history `loadFromHistory` function calls
  // onNameOfEvent
  // framework magic
  onNewGameStartedEvent(event: NewGameStartedEvent) {
    this.playerId = event.playerId;
    this.wordToGuess = event.wordToGuess;
    this.maxGuesses = event.maxGuesses;
    // this.lettersGuessed = []; // Is this necessary?
    this.dateCreated = event.dateCreated;
    this.dateModified = event.dateModified;
  }

  onLetterGuessedEvent(event: LetterGuessedEvent) {
    this.lettersGuessed.push(event.letter[0]);
    this.dateModified = event.dateModified; // FIXME: date modified not passed from command handler
  }
}
