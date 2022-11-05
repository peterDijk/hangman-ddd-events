import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { UserDto } from 'src/infrastructure/dto/User.dto';
import { CreateNewUserCommand } from '../../domains/User/Commands/CreateNewUser.command';
import { UserRepository } from '../../domains/User/User.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly commandBus: CommandBus,
  ) // private userRepository: UserRepository,
  {}
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

  // async findByLogin({ username, password }: LoginUserDto): Promise<UserDto> {
  //   const user = await this.userRepository.findOneByUsername(username);

  //   if (!user) {
  //     throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
  //   }

  //   // compare passwords
  //   const areEqual = await bcrypt.compare(password, user.password);

  //   if (!areEqual) {
  //     throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
  //   }

  //   return {
  //     id: user.id,
  //     email: user.email,
  //     username: user.username,
  //   };
  // }
}
