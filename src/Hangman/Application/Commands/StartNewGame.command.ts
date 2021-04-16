import { ICommand } from '@nestjs/cqrs';

export class StartNewGameCommand implements ICommand {
  constructor(
    public playerId: string,
    public wordToGuess: string,
    public maxGuesses: number,
  ) {}
}
