import { ICommand } from '@nestjs/cqrs';
import { UserDto } from '../../Infrastructure/Dto/User.dto';

export class CreateNewUserCommand implements ICommand {
  constructor(public data: UserDto, public uuid: string) {}
}
