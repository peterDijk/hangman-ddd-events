import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtPayload, LoginStatus, LoginUserDto } from '../dto/Auth.dto';
import { CommandBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import { LoginUserCommand } from '../../domains/User/Commands/LoginUser.command';
import { UserRepository } from '../../domains/User/User.repository';
import { User } from '../../domains/User/User.aggregate';
import { createToken } from '../../helpers/createToken';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly commandBus: CommandBus,
    private userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login({ username, password }: LoginUserDto): Promise<LoginStatus> {
    const user = await this.commandBus.execute(
      new LoginUserCommand(username, password),
    );

    this.logger.debug(`logged in user: ${JSON.stringify(user)}`);

    const { accessToken } = createToken(user.username, this.jwtService);

    return {
      username: user.userName.value,
      accessToken,
    };
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.userRepository.findOneByUsername(payload.username);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    if (user.currentlyLoggedIn) {
      return user;
    } else {
      throw new HttpException(
        'User is logged out, please login again for new token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
