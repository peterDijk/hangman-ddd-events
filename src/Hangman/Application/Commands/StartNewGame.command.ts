import { ICommand } from '@nestjs/cqrs';
import { GameDto } from 'src/Hangman/Domain/AggregateRoot/GameDto';

export class StartNewGameCommand implements ICommand {
  gameDto = {} as GameDto;

  constructor({ gameId, playerId, wordToGuess, maxGuesses }: GameDto) {
    if (
      !gameId &&
      !playerId &&
      !wordToGuess &&
      wordToGuess !== '' &&
      maxGuesses &&
      maxGuesses > 0
    ) {
      throw new Error('u oh');
    }

    this.gameDto = { gameId, playerId, wordToGuess, maxGuesses };
  }
}
