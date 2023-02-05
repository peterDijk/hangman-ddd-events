import { AggregateRoot } from '@nestjs/cqrs';
import { ObjectType } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';

import { NewGameStartedEvent } from './Events/NewGameStarted.event';
import { InvalidGameException } from '../../infrastructure/exceptions';
import { GameDto } from '../../infrastructure/dto/Game.dto';
import { LetterGuessedEvent } from './Events/LetterGuessed.event';
import { Word } from './ValueObjects/Word.value-object';
import { MaxGuesses } from './ValueObjects/MaxGuesses.value-object';
import { LettersGuessed } from './ValueObjects/LettersGuessed.value-object';
import { Letter } from './ValueObjects/Letter.value-object';
import { User } from '../User/User.aggregate';
import { UserRepository } from '../User/User.repository';

@ObjectType()
export class Game extends AggregateRoot {
  public readonly id: string;
  private userRepository: UserRepository;

  dateCreated: Date;
  dateModified: Date;

  player: User;

  wordToGuess: Word;
  maxGuesses: MaxGuesses;
  lettersGuessed: LettersGuessed;

  constructor(id: string, userRepository: UserRepository, user?: User) {
    super();
    this.id = id;
    this.userRepository = userRepository;
    // if (user) {
    this.player = user;
    // }
  }

  private logger = new Logger(Game.name);

  async startNewGame(data: GameDto) {
    // if (!this.player) {
    //   this.player = await this.userRepository.findOneById(data.playerId);
    // }
    this.wordToGuess = await Word.create(data.wordToGuess);
    this.maxGuesses = await MaxGuesses.create(data.maxGuesses);
    this.dateCreated = new Date();
    this.dateModified = new Date();

    this.apply(
      new NewGameStartedEvent(
        this.id,
        this.player.id,
        this.wordToGuess.value,
        this.maxGuesses.value,
        this.dateCreated,
        this.dateModified,
      ),
      false,
    );
  }

  async guessLetter(letter: string): Promise<Game> {
    // TODO: validate guess
    // validation is done in LettersGuessed VA (length) and Letter VA (string, 1 char)

    try {
      const newLetter = await Letter.create(letter);
      const lettersGuessed = await LettersGuessed.create(
        [...this.lettersGuessed.value, newLetter],
        this.maxGuesses,
      );
      const newLettersGuessed = lettersGuessed;

      this.logger.debug(`newLettersGuessed: ${newLettersGuessed.value}`);

      this.lettersGuessed = newLettersGuessed;
      this.dateModified = new Date();

      const event = new LetterGuessedEvent(this.id, letter, this.dateModified);

      this.logger.warn(')))))))))');
      this.logger.warn(this.lettersGuessed.value);

      this.apply(event, false);

      return this;
    } catch (err) {
      throw new InvalidGameException(err);
    }
  }

  // Replay event from history `loadFromHistory` function calls
  // onNameOfEvent
  // framework magic
  async onNewGameStartedEvent(event: NewGameStartedEvent) {
    this.wordToGuess = Word.createReplay(event.wordToGuess);
    this.maxGuesses = MaxGuesses.createReplay(event.maxGuesses);
    this.lettersGuessed = LettersGuessed.createReplay([]);
    this.dateCreated = event.dateCreated;
    this.dateModified = event.dateModified;
    // error when this line is on top. buggy, should be improved
    this.player = await this.userRepository.findOneById(event.playerId);
  }

  onLetterGuessedEvent(event: LetterGuessedEvent) {
    this.lettersGuessed = LettersGuessed.createReplay([
      ...this.lettersGuessed.value,
      Letter.createReplay(event.letter[0]),
    ]);
    this.dateModified = event.dateModified;
  }
}
