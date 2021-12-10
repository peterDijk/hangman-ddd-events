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
    // apply to be able to validate
    this.playerId = data.playerId;
    this.wordToGuess = data.wordToGuess;
    this.maxGuesses = data.maxGuesses;
    this.lettersGuessed = [];
    this.dateCreated = new Date();
    this.dateModified = new Date();

    try {
      await validateOrReject(this);

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
    this.lettersGuessed.push(`${letter[0]}`);

    if (this.lettersGuessed?.length - 1 >= this.maxGuesses) {
      throw new InvalidGameException('Max guesses, game over');
    }

    const event = new LetterGuessedEvent(this.id, letter, this.lettersGuessed);
    this.logger.log(`this.lettersGuessed: ${this.lettersGuessed}`);
    this.logger.log(event);

    this.apply(event, false);
  }

  // Replay event from history `loadFromHistory` function calls
  // onNameOfEvent
  // framework magic
  onNewGameStartedEvent(event: NewGameStartedEvent) {
    this.logger.log(
      `onNewGameStartedEvent: replaying from history: ${event.id}`,
    );
    this.playerId = event.playerId;
    this.wordToGuess = event.wordToGuess;
    this.maxGuesses = event.maxGuesses;
    this.lettersGuessed = [];
    this.dateCreated = event.dateCreated;
    this.dateModified = event.dateModified;
  }

  onLetterGuessedEvent(event: LetterGuessedEvent) {
    this.logger.log(
      `onLetterGuessedEvent: replaying from history: ${event.id} | event.lettersGuessed: ${event.lettersGuessed}`,
    );
    this.logger.log(`Aggregate: ${JSON.stringify(this)}`);
    // mutating the aggregate here changes the this.lettersGuessed of the event
    // that was send and applied in `guessLetter`?! not good
    // because they get the letter double added
    // (adding in guessLetter for validation)
    // above comment applied when I was doing the this.lettersGuessed.push
    // here as well. But since I get the complete value in the event
    // I can just as well set this.lettersGuessed to the whole new value

    this.lettersGuessed = event.lettersGuessed;
    this.dateModified = event.dateModified;
  }
}
