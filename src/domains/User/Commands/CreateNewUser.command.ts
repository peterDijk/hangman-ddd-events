import { ICommand } from '@nestjs/cqrs';
import { UserDto } from '../../../infrastructure/dto/User.dto';

export class CreateNewUserCommand implements ICommand {
  constructor(public data: UserDto, public uuid: string) {}
}
