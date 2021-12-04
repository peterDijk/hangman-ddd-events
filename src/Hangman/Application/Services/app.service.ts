import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventStoreState } from '../../ReadModels/eventstore-state.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  getHealth(): Record<string, unknown> {
    return {
      message: 'ok',
    };
  }
}
