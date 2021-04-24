import { Module, Logger } from '@nestjs/common';
import { EventStoreModule } from '@juicycleff/nestjs-event-store';
import { TypeOrmModule } from '@nestjs/typeorm';
import TypeOrmConfig from '../../ormconfig';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from '../controllers/app.controller';
import { AppService } from '../Hangman/Application/Services/app.service';
import { GamesModule } from './game.module';
import { config } from '../../config';

@Module({
  imports: [
    // AuthModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      introspection: process.env.GQL_PLAYGROUND === 'enabled' ? true : false,
      playground: process.env.GQL_PLAYGROUND === 'enabled' ? true : false,
      cors: true,
    }),
    EventStoreModule.register({
      type: 'event-store',
      tcpEndpoint: {
        host: config.EVENT_STORE_SETTINGS.hostname,
        port: config.EVENT_STORE_SETTINGS.tcpPort,
      },
      options: {
        maxRetries: 1000, // Optional
        maxReconnections: 1000, // Optional
        reconnectionDelay: 1000, // Optional
        heartbeatInterval: 1000, // Optional
        heartbeatTimeout: 1000, // Optional
        defaultUserCredentials: {
          password: config.EVENT_STORE_SETTINGS.credentials.username,
          username: config.EVENT_STORE_SETTINGS.credentials.password,
        },
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'projections.db',
      port: 3306,
      username: 'root',
      password: 'example',
      database: 'hangman-projections',
      entities: [],
      synchronize: true,
    }),
    GamesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
