import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from '../services/user.service';
import { UserDto, UserResponse } from '../dto/User.dto';
import { User } from '../../domains/User/User.aggregate';

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
}
