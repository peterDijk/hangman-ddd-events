import { ICommand } from '@nestjs/cqrs';

export class GuessLetterCommand implements ICommand {
  constructor(public gameId: string, public letter: string) {}
}
