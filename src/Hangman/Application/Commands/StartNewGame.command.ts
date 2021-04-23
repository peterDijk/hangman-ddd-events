import { ICommand } from '@nestjs/cqrs';

export class StartNewGameCommand implements ICommand {
  constructor(
    public gameId: string,
    public playerId: string,
    public wordToGuess: string,
    public maxGuesses: number,
  ) {}
}
