import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { UserDto } from 'src/infrastructure/dto/User.dto';
import { CreateNewUserCommand } from '../../domains/User/Commands/CreateNewUser.command';
import { ChangeFullNameCommand } from '../../domains/User/Commands/ChangeFullName.command';
import { UserRepository } from '../../domains/User/User.repository';
import { User as UserProjection } from '../read-models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domains/User/User.aggregate';

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

  async changeFullName(user: User, newFullName: string) {
    try {
      this.logger.log(user.fullName);
      this.logger.log(
        `user '${user.userName.value}' (${user.fullName.value}) wants to change their full name to '${newFullName}'`,
      );
      const oldFullName = user.fullName.value;
      await this.commandBus.execute(
        new ChangeFullNameCommand(user, newFullName),
      );
      return {
        message: `full name updated from '${oldFullName}' to ${newFullName}`,
        status: 204,
        userId: user.id,
        username: user.userName.value,
        fullName: user.fullName.value,
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async getAllUsers(): Promise<{ count: number; users: UserProjection[] }> {
    const users = await this.usersProjectionRepository.find({
      order: { dateModified: 'DESC' },
    });

    console.log('is Date', users[0].dateCreated instanceof Date);
    return {
      count: users.length,
      users,
    };
  }
}
