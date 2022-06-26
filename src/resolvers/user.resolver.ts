import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from '../Hangman/Application/Services/user.service';
import { UserDto, UserResponse } from '../Hangman/Infrastructure/Dto/User.dto';
import { User } from '../Hangman/Domain/AggregateRoot/User.aggregate';

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
