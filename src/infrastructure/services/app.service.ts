import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): Record<string, unknown> {
    return {
      message: 'ok',
    };
  }
}
