import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '../../domains/User/User.aggregate';
import { LoginStatus, LoginUserDto } from '../dto/Auth.dto';
import { CurrentUser, GqlAuthGuard } from '../modules/graphql.guard';
import { AuthService } from '../services/auth.service';

@Resolver((of) => User)
export class AuthResolver {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  @Mutation((returns) => LoginStatus)
  async loginUser(@Args('input') loginDto: LoginUserDto): Promise<LoginStatus> {
    return await this.authService.login(loginDto);
  }

  @Mutation((returns) => String, { description: 'Authorized' })
  @UseGuards(GqlAuthGuard)
  async logoutUser(@CurrentUser() user: User): Promise<unknown> {
    await this.authService.logout(user);
    return 'logged out';
  }
}
