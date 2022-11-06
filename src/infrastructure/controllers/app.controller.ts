import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from '../services/app.service';

@Controller('health')
@ApiTags('Health check')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiResponse({ status: 200, description: 'Perform API health check' })
  @Get()
  getHealth(): Record<string, unknown> {
    return this.appService.getHealth();
  }

  @UseGuards(AuthGuard())
  @Get('protectedHealth')
  protectedHealth(): any {
    return this.appService.getAuthHealth();
  }
}
