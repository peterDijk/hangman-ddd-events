import { Module } from '@nestjs/common';
import { EventStoreModule } from '@juicycleff/nestjs-event-store';

import { AppController } from '../controllers/app.controller';
import { AppService } from '../Hangman/Application/Services/app.service';
import { GamesModule } from './game.module';
import { config } from '../../config';

@Module({
  imports: [
    EventStoreModule.register({
      type: 'event-store',
      tcpEndpoint: {
        host: config.config.base.EVENT_STORE_SETTINGS.hostname,
        port: config.config.base.EVENT_STORE_SETTINGS.tcpPort,
      },
      options: {
        maxRetries: 1000, // Optional
        maxReconnections: 1000, // Optional
        reconnectionDelay: 1000, // Optional
        heartbeatInterval: 1000, // Optional
        heartbeatTimeout: 1000, // Optional
        defaultUserCredentials: {
          password:
            config.config.base.EVENT_STORE_SETTINGS.credentials.username,
          username:
            config.config.base.EVENT_STORE_SETTINGS.credentials.password,
        },
      },
    }),
    GamesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}