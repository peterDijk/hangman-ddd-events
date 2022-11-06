import { ICommand } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

export class LoginUserCommand implements ICommand {
  constructor(
    public username: string,
    public password: string,
    public jwtService: JwtService,
  ) {}
}
