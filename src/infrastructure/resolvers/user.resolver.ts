import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from '../services/user.service';
import { UserDto, UserResponse } from '../dto/User.dto';
import { User } from '../../domains/User/User.aggregate';
import { AllUsersResponse } from '../dto/Api.dto';
import { User as UserProjection } from '../read-models/user.entity';
import { CurrentUser, GqlAuthGuard } from '../modules/graphql.guard';

@Resolver((of) => User)
export class UserResolver {
  constructor(@Inject(UserService) private userService: UserService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello Users!';
  }

  @Mutation((returns) => UserResponse)
  async createNewUser(@Args('input') userDto: UserDto): Promise<UserResponse> {
    return await this.userService.createUser(userDto);
  }

  @Mutation((returns) => UserResponse)
  @UseGuards(GqlAuthGuard)
  async changeFullName(
    @Args('newFullName') newFullName: string,
    @CurrentUser() user: User,
  ): Promise<UserResponse> {
    return await this.userService.changeFullName(user, newFullName);
  }

  @Query((returns) => AllUsersResponse)
  async getAllUsers(): Promise<{ count: number; users: UserProjection[] }> {
    return await this.userService.getAllUsers();
  }
}
