import { Injectable, UseGuards } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): Record<string, unknown> {
    return {
      message: 'ok',
    };
  }

  getAuthHealth(): Record<string, unknown> {
    return {
      message: 'secret handshake, welcome to the club ;)',
    };
  }
}
