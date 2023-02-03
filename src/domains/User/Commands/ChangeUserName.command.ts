import { ICommand } from '@nestjs/cqrs';

export class ChangeUserNameCommand implements ICommand {
  constructor(public userId: string, public newUsername: string) {}
}
