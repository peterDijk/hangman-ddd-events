import {
  BadRequestException,
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { JwtPayload, LoginStatus, LoginUserDto } from '../dto/Auth.dto';
import { CommandBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import { LoginUserCommand } from '../../domains/User/Commands/LoginUser.command';
import { UserRepository } from '../../domains/User/User.repository';
import { User } from '../../domains/User/User.aggregate';
import { createToken } from '../../helpers/createToken';
import { LogoutUserCommand } from '../../domains/User/Commands/LogoutUser.command';
import { CACHE_KEYS } from '../constants';
@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly commandBus: CommandBus,
    private userRepository: UserRepository,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.logger.debug(`type of cacheManager: ${typeof this.cacheManager}`);
  }

  async login({ username, password }: LoginUserDto): Promise<LoginStatus> {
    const user: User = await this.commandBus.execute(
      new LoginUserCommand(username, password),
    );

    const { accessToken } = createToken(user.userName.value, this.jwtService);

    return {
      userId: user.id,
      username: user.userName.value,
      accessToken,
    };
  }

  async logout(user: User): Promise<User> {
    const loggedOutUser: User = await this.commandBus.execute(
      new LogoutUserCommand(user),
    );

    return loggedOutUser;
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    // const cacheKey = `${CACHE_KEYS.CACHE_ID_BY_USERNAME_KEY}-${payload.username}`;
    // const userId = await this.cacheManager.get(cacheKey);

    // if (!userId) {
    //   this.logger.debug(
    //     `couldn't find userId in cache (cacheKey: ${cacheKey})`,
    //   );
    // }

    // const user: User = await this.cacheManager.get(
    //   `${CACHE_KEYS.AGGREGATE_KEY}-user-${userId}`,
    // );

    const user = await this.userRepository.findOneByUsername(payload.username);

    if (!user) {
      this.logger.debug(`couldnt find user`);
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
