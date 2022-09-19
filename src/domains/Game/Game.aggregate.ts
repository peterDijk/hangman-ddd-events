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

import { NewGameStartedEvent } from './Events/NewGameStarted.event';
import { InvalidGameException } from '../../infrastructure/exceptions';
import { GameDto } from '../../infrastructure/dto/Game.dto';
import { LetterGuessedEvent } from './Events/LetterGuessed.event';
import { Word } from './ValueObjects/Word.value-object';
import { MaxGuesses } from './ValueObjects/MaxGuesses.value-object';
import { LettersGuessed } from './ValueObjects/LettersGuessed.value-object';
import { Letter } from './ValueObjects/Letter.value-object';

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
    this.playerId = data.playerId;
    this.wordToGuess = await Word.create(data.wordToGuess);
    this.maxGuesses = await MaxGuesses.create(data.maxGuesses);
    this.dateCreated = new Date();
    this.dateModified = new Date();

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
  }

  async guessLetter(letter: string) {
    // TODO: validate guess
    // validation is done in LettersGuessed VA (length) and Letter VA (string, 1 char)

    try {
      const newLetter = await Letter.create(letter);
      const lettersGuessed = await LettersGuessed.create(
        [...this.lettersGuessed.value, newLetter],
        this.maxGuesses,
      );
      const newLettersGuessed = lettersGuessed;

      this.lettersGuessed = newLettersGuessed;
      this.dateModified = new Date();

      const event = new LetterGuessedEvent(this.id, letter, this.dateModified);

      this.apply(event, false);
    } catch (err) {
      throw new InvalidGameException(err);
    }
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
      Letter.createReplay(event.letter[0]),
    ]);
    this.dateModified = event.dateModified;
  }
}
