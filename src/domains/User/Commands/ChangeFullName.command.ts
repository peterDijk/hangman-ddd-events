import { ICommand } from '@nestjs/cqrs';
import { User } from '../User.aggregate';

export class ChangeFullNameCommand implements ICommand {
  constructor(public user: User, public newFullName: string) {}
}
