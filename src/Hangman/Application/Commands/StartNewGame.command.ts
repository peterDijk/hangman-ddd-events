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
  public gameId: string;

  @IsString()
  @MinLength(2)
  public playerId: string;

  @IsString()
  public wordToGuess: string;

  @IsNumber()
  @Min(1)
  public maxGuesses: number;

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

    // validateOrReject(this).catch((err) => {
    //   Logger.log('validation error', JSON.stringify(err));
    //   throw new InvalidCommandException('InvalidCommandException');
    // });

    // validate(this).then((err) => {
    //   Logger.log('validation error', JSON.stringify(err));
    //   throw new InvalidCommandException();
    // });

    if (
      !gameId ||
      gameId !== '' ||
      !playerId ||
      playerId !== '' ||
      !wordToGuess ||
      wordToGuess !== '' ||
      maxGuesses ||
      maxGuesses > 0
    ) {
      Logger.log('validation error');

      throw new InvalidCommandException();
    }
    // throw new InvalidCommandException();
  }
}
