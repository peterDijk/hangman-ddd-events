import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { UserDto } from 'src/Hangman/Infrastructure/Dto/User.dto';
import { CreateNewUserCommand } from '../Commands/CreateNewUser.command';

@Injectable()
export class UserService {
  constructor(private readonly commandBus: CommandBus) {}
  private readonly logger = new Logger(UserService.name);

  async createUser(data: UserDto) {
    try {
      const userId = uuidv4();
      await this.commandBus.execute(new CreateNewUserCommand(data, userId));
      this.logger.log(`New user created: ${userId}`);
      return {
        message: 'success',
        status: 201,
        userId,
        username: data.username,
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
