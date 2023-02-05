import {
  Controller,
  Post,
  Body,
  Logger,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { User } from '../../domains/User/User.aggregate';
import { UserDto } from '../dto/User.dto';
import { CurrentUser } from '../modules/graphql.guard';
import { UserService } from '../services/user.service';

@Controller('users')
@ApiTags('Games')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly userService: UserService) {}

  @ApiResponse({ status: 201, description: 'User created' })
  @Post('new')
  async createNewUser(
    @Body()
    userDto: UserDto,
  ) {
    return await this.userService.createUser(userDto);
  }

  @ApiResponse({ status: 204, description: 'Username changed' })
  @Post('update')
  async changeUsername(
    @Body()
    { userId, newUsername }: { userId: string; newUsername: string },
    @CurrentUser() user: User,
  ) {
    return await this.userService.changeUsername(user, newUsername);
  }

  @ApiResponse({ status: 200, description: 'List games' })
  @Get('list')
  @UseInterceptors(ClassSerializerInterceptor)
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }
}
