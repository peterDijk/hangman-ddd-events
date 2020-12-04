import { Module } from '@nestjs/common';
import { EventStoreModule } from './core/event-store/event-store.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [EventStoreModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
