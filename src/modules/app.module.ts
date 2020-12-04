import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../Hangman/Application/Services/app.service';
import { GamesModule } from './game.module';
import { EventStoreModule } from 'src/core/event-store/event-store.module';

@Module({
  imports: [EventStoreModule.forRoot(), GamesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
