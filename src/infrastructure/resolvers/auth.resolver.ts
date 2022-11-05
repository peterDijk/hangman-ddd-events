import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '../../domains/User/User.aggregate';
import { LoginStatus, LoginUserDto } from '../dto/Auth.dto';
import { AuthService } from '../services/auth.service';

@Resolver((of) => User)
export class AuthResolver {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  @Mutation((returns) => LoginStatus)
  async loginUser(@Args('input') loginDto: LoginUserDto): Promise<LoginStatus> {
    return await this.authService.login(loginDto);
  }
}
