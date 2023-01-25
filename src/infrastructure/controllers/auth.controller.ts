import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../../domains/User/User.aggregate';
import { LoginStatus } from '../dto/Auth.dto';
import { CurrentUser } from '../modules/graphql.guard';
import { AppService } from '../services/app.service';
import { AuthService } from '../services/auth.service';

@Controller('auth')
@ApiTags('Authorization')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 200, description: 'Login' })
  @Post('login')
  async login(@Body() { username, password }): Promise<any> {
    const login = await this.authService.login({ username, password });
    return login; //LoginStatus
  }

  @UseGuards(AuthGuard())
  @Get('logout')
  async logout(@CurrentUser() user: User): Promise<any> {
    const loggedOutUser = await this.authService.logout(user);
    return loggedOutUser;
  }
}
