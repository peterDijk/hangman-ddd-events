import { ICommand } from '@nestjs/cqrs';

export class GuessLetterCommand implements ICommand {
  constructor(public readonly gameId: string, public readonly letter: string) {}
}
