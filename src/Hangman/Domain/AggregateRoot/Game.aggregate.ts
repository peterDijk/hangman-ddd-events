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
import { MaxGuesses } from '../ValueObjects/MaxGuesses.value-object';
import { LettersGuessed } from '../ValueObjects/LettersGuessed.value-object';

@ObjectType()
export class Game extends AggregateRoot {
  public readonly id: string;

  dateCreated: Date;
  dateModified: Date;

  @IsString()
  @MinLength(2)
  playerId: string;

  wordToGuess: Word;
  maxGuesses: MaxGuesses;
  lettersGuessed: LettersGuessed;

  constructor(id: string) {
    super();
    this.id = id;
  }

  private logger = new Logger(Game.name);

  async startNewGame(data: GameDto) {
    // apply to be able to validate
    this.playerId = data.playerId;
    this.wordToGuess = await Word.create(data.wordToGuess);
    this.maxGuesses = await MaxGuesses.create(data.maxGuesses);
    this.dateCreated = new Date();
    this.dateModified = new Date();

    try {
      // await validateOrReject(this);

      this.apply(
        new NewGameStartedEvent(
          this.id,
          this.playerId,
          this.wordToGuess.value,
          this.maxGuesses.value,
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

    const newLettersGuessed = [...this.lettersGuessed.value, letter];

    if (newLettersGuessed.length >= this.maxGuesses.value) {
      throw new InvalidGameException('Max guesses, game over');
    }

    const dateModified = new Date();

    const event = new LetterGuessedEvent(this.id, letter, dateModified);

    this.apply(event, false);
  }

  // Replay event from history `loadFromHistory` function calls
  // onNameOfEvent
  // framework magic
  onNewGameStartedEvent(event: NewGameStartedEvent) {
    this.playerId = event.playerId;
    this.wordToGuess = Word.createReplay(event.wordToGuess);
    this.maxGuesses = MaxGuesses.createReplay(event.maxGuesses);
    this.lettersGuessed = LettersGuessed.createReplay([]);
    this.dateCreated = event.dateCreated;
    this.dateModified = event.dateModified;
  }

  onLetterGuessedEvent(event: LetterGuessedEvent) {
    this.lettersGuessed = LettersGuessed.createReplay([
      ...this.lettersGuessed.value,
      event.letter[0],
    ]);
    this.dateModified = event.dateModified;
  }
}
