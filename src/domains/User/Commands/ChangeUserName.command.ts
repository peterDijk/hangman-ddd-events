import { ICommand } from '@nestjs/cqrs';
import { User } from '../User.aggregate';

export class ChangeUserNameCommand implements ICommand {
  constructor(public user: User, public newUsername: string) {}
}
