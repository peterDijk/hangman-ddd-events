import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { UserDto } from 'src/infrastructure/dto/User.dto';
import { CreateNewUserCommand } from '../../domains/User/Commands/CreateNewUser.command';
import { ChangeUserNameCommand } from '../../domains/User/Commands/ChangeUserName.command';
import { UserRepository } from '../../domains/User/User.repository';
import { User as UserProjection } from '../read-models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly commandBus: CommandBus,
    private userRepository: UserRepository,
    @InjectRepository(UserProjection)
    private usersProjectionRepository: Repository<UserProjection>,
  ) {}
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

  async changeUsername(userId: string, newUsername: string) {
    try {
      const user = await this.userRepository.findOneById(userId);
      await this.commandBus.execute(
        new ChangeUserNameCommand(userId, newUsername),
      );
      return {
        message: `username updated from '${user.userName.value}' to ${newUsername}`,
        status: 204,
        userId: userId,
        username: newUsername,
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async getAllUsers(): Promise<{ count: number; users: UserProjection[] }> {
    const users = await this.usersProjectionRepository.find({
      order: { dateModified: 'DESC' },
    });
    return {
      count: users.length,
      users,
    };
  }
}
