import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from 'src/Hangman/Application/Services/app.service';

@Controller('health')
@ApiTags('Health check')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiResponse({ status: 200, description: 'Perform API health check' })
  @Get()
  getHealth(): Record<string, unknown> {
    return this.appService.getHealth();
  }
}
