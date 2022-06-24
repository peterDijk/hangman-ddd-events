import { AggregateRoot } from '@nestjs/cqrs';
import {
  IsString,
  validateOrReject,
  IsNumber,
  MinLength,
  Min,
} from 'class-validator';
import { Field, ObjectType } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';

import { NewGameStartedEvent } from '../Events/NewGameStarted.event';
import { InvalidGameException } from '../../Exceptions';
import { GameDto } from '../../Infrastructure/Dto/Game.dto';
import { LetterGuessedEvent } from '../Events/LetterGuessed.event';
import { Word } from '../ValueObjects/Word.value-object';

@ObjectType()
export class Game extends AggregateRoot {
  public readonly id: string;

  dateCreated: Date;
  dateModified: Date;

  @Field()
  @IsString()
  @MinLength(2)
  playerId: string;

  // @IsString()
  // @MinLength(3)
  @Field()
  wordToGuess: Word;

  @Field()
  @IsNumber()
  @Min(1)
  maxGuesses: number;

  @Field((type) => [String])
  lettersGuessed: string[];

  constructor(id: string) {
    super();
    this.id = id;
  }

  private logger = new Logger(Game.name);

  async startNewGame(data: GameDto) {
    // apply to be able to validate
    this.playerId = data.playerId;
    this.wordToGuess = await Word.create(data.wordToGuess);
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
          this.wordToGuess.value,
          this.maxGuesses,
          this.dateCreated,
          this.dateModified,
        ),
        false,
      );
    } catch (err) {
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

    const dateModified = new Date();

    const event = new LetterGuessedEvent(this.id, letter, dateModified);

    this.apply(event, false);
  }

  // Replay event from history `loadFromHistory` function calls
  // onNameOfEvent
  // framework magic
  async onNewGameStartedEvent(event: NewGameStartedEvent) {
    this.playerId = event.playerId;
    this.wordToGuess = await Word.create(event.wordToGuess);
    this.maxGuesses = event.maxGuesses;
    this.lettersGuessed = [];
    this.dateCreated = event.dateCreated;
    this.dateModified = event.dateModified;
  }

  onLetterGuessedEvent(event: LetterGuessedEvent) {
    this.lettersGuessed.push(event.letter[0]);
    this.dateModified = event.dateModified;
  }
}
