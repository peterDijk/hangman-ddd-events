import { ICommand } from '@nestjs/cqrs';
import { User } from '../../../domains/User/User.aggregate';

export class GuessLetterCommand implements ICommand {
  constructor(
    public gameId: string,
    public letter: string,
    public user: User,
  ) {}
}
