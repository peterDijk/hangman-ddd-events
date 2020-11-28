import { Controller, Get, HttpCode, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHealth(): Record<string, unknown> {
    return this.appService.getHealth();
  }
}
