import { ICommand } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { User } from '../User.aggregate';

export class LogoutUserCommand implements ICommand {
  constructor(public user: User) {}
}
