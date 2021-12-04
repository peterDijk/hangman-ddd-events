import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventStoreStateService } from '../Hangman/Application/Services/eventstore.service';
import { EventStoreState } from '../Hangman/ReadModels/eventstore-state.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventStoreState])],
  providers: [EventStoreStateService],
  exports: [EventStoreStateService],
})
export class EventStoreStateModule {}
