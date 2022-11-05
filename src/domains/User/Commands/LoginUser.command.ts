import { ICommand } from '@nestjs/cqrs';

export class LoginUserCommand implements ICommand {
  constructor(public username: string, public password: string) {}
}
