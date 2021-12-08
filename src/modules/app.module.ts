import { Module, Logger } from '@nestjs/common';
import { EventStoreModule } from '@juicycleff/nestjs-event-store';
import { EventSourcingModule } from '@berniemac/event-sourcing-nestjs';
import { TypeOrmModule } from '@nestjs/typeorm';
import TypeOrmConfig from '../../ormconfig';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from '../controllers/app.controller';
import { AppService } from '../Hangman/Application/Services/app.service';
import { GamesModule } from './game.module';
import { config } from '../../config';
// import { mongoDbUri } from '../mongo/database';

export const mongoDbUri = `${config.STORE_STATE_SETTINGS.type}://${config.STORE_STATE_SETTINGS.credentials.username}:${config.STORE_STATE_SETTINGS.credentials.password}@${config.STORE_STATE_SETTINGS.hostname}:${config.STORE_STATE_SETTINGS.port}`;
@Module({
  imports: [
    // AuthModule,
    // GraphQLModule.forRoot({
    //   autoSchemaFile: 'schema.gql',
    //   introspection: process.env.GQL_PLAYGROUND === 'enabled' ? true : false,
    //   playground: process.env.GQL_PLAYGROUND === 'enabled' ? true : false,
    //   cors: true,
    // }),
    EventSourcingModule.forRoot({
      mongoURL: `${mongoDbUri}/eventstore`,
    }),
    // EventStoreModule.register({
    //   type: 'event-store',
    //   tcpEndpoint: {
    //     host: config.EVENT_STORE_SETTINGS.hostname,
    //     port: config.EVENT_STORE_SETTINGS.tcpPort,
    //   },
    //   options: {
    //     maxRetries: 1000, // Optional
    //     maxReconnections: 1000, // Optional
    //     reconnectionDelay: 1000, // Optional
    //     heartbeatInterval: 1000, // Optional
    //     heartbeatTimeout: 1000, // Optional
    //     defaultUserCredentials: {
    //       password: config.EVENT_STORE_SETTINGS.credentials.username,
    //       username: config.EVENT_STORE_SETTINGS.credentials.password,
    //     },
    //   },
    // }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => TypeOrmConfig as any,
    }),
    GamesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
