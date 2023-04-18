import { AggregateRoot } from '@nestjs/cqrs';
import { ObjectType } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { Transform } from 'class-transformer';

import { NewGameStartedEvent } from './Events/NewGameStarted.event';
import { InvalidGameException } from '../../infrastructure/exceptions';
import { GameDto } from '../../infrastructure/dto/Game.dto';
import { LetterGuessedEvent } from './Events/LetterGuessed.event';
import { Word } from './ValueObjects/Word.value-object';
import { MaxGuesses } from './ValueObjects/MaxGuesses.value-object';
import { LettersGuessed } from './ValueObjects/LettersGuessed.value-object';
import { Letter } from './ValueObjects/Letter.value-object';
import { User } from '../User/User.aggregate';

@ObjectType()
export class Game extends AggregateRoot {
  public readonly id: string;

  dateCreated: Date;
  dateModified: Date;

  player: User;

  @Transform(({ value }) => Word.createReplay(value.props.value), {
    toClassOnly: true,
  })
  wordToGuess: Word;

  @Transform(({ value }) => MaxGuesses.createReplay(value.props.value), {
    toClassOnly: true,
  })
  maxGuesses: MaxGuesses;

  @Transform(
    ({ value }) =>
      LettersGuessed.createReplay(
        value.props.value.map((letter) =>
          Letter.createReplay(letter.props.value),
        ),
      ),
    {
      toClassOnly: true,
    },
  )
  lettersGuessed: LettersGuessed;

  constructor(id: string) {
    super();
    this.id = id;
  }

  private logger = new Logger(Game.name);

  async startNewGame(data: GameDto, user: User) {
    try {
      const wordToGuess = await Word.create(data.wordToGuess);
      const maxGuesses = await MaxGuesses.create(data.maxGuesses);
      const dateCreated = new Date();
      const dateModified = new Date();

      this.apply(
        new NewGameStartedEvent(
          this.id,
          user.id,
          wordToGuess.value,
          maxGuesses.value,
          dateCreated,
          dateModified,
        ),
        false,
      );

      return this;
    } catch (err) {
      return new InvalidGameException(err);
    }
  }

  async guessLetter(letter: string): Promise<Game> {
    // TODO: validate guess
    // validation is done in LettersGuessed VA (length) and Letter VA (string, 1 char)

    try {
      const newLetter = await Letter.create(letter);
      await LettersGuessed.create(
        [...this.lettersGuessed.value, newLetter],
        this.maxGuesses,
      );

      const dateModified = new Date();

      const event = new LetterGuessedEvent(this.id, letter, dateModified);

      this.apply(event, false);

      return this;
    } catch (err) {
      throw new InvalidGameException(err);
    }
  }

  async onNewGameStartedEvent(event: NewGameStartedEvent) {
    this.wordToGuess = Word.createReplay(event.wordToGuess);
    this.maxGuesses = MaxGuesses.createReplay(event.maxGuesses);
    this.lettersGuessed = LettersGuessed.createReplay([]);
    this.dateCreated = event.dateCreated;
    this.dateModified = event.dateModified;
    // creating new user with id only, because can't wait for async user repository
    this.player = new User(event.playerId);
  }

  onLetterGuessedEvent(event: LetterGuessedEvent) {
    this.lettersGuessed = LettersGuessed.createReplay([
      ...this.lettersGuessed.value,
      Letter.createReplay(event.letter[0]),
    ]);
    this.dateModified = event.dateModified;
  }
}
