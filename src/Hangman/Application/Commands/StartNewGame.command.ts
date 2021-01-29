import { ICommand } from '@nestjs/cqrs';
import {
  IsString,
  validate,
  validateOrReject,
  IsNumber,
  MinLength,
  Min,
} from 'class-validator';

import { InvalidCommandException } from 'src/Hangman/Exceptions';
import { Logger } from '@nestjs/common';

export class StartNewGameCommand implements ICommand {
  @IsString()
  @MinLength(4)
  gameId: string;

  @IsString()
  @MinLength(2)
  playerId: string;

  @IsString()
  wordToGuess: string;

  @IsNumber()
  @Min(1)
  maxGuesses: number;

  constructor(
    gameId: string,
    playerId: string,
    wordToGuess: string,
    maxGuesses: number,
  ) {
    this.gameId = gameId;
    this.playerId = playerId;
    this.wordToGuess = wordToGuess;
    this.maxGuesses = maxGuesses;

    // TODO: make class-validator work (= promise)
    // validateOrReject(this).catch((err) => {
    //   Logger.log('validation error', JSON.stringify(err));
    //   throw new InvalidCommandException('InvalidCommandException');
    // });

    if (
      !gameId ||
      gameId === '' ||
      !playerId ||
      playerId === '' ||
      !wordToGuess ||
      wordToGuess === '' ||
      !maxGuesses ||
      maxGuesses < 1
    ) {
      console.log({ gameId, playerId, wordToGuess, maxGuesses });
      Logger.log('validation error');

      throw new InvalidCommandException();
    }
  }
}
