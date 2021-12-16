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

export const mongoDbUri = `${config.STORE_STATE_SETTINGS.type}://${config.STORE_STATE_SETTINGS.credentials.username}:${config.STORE_STATE_SETTINGS.credentials.password}@${config.STORE_STATE_SETTINGS.hostname}:${config.STORE_STATE_SETTINGS.port}`;
@Module({
  imports: [
    // AuthModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      introspection: process.env.GQL_PLAYGROUND === 'enabled' ? true : false,
      playground: process.env.GQL_PLAYGROUND === 'enabled' ? true : false,
      cors: true,
    }),
    EventSourcingModule.forRoot({
      mongoURL: `${mongoDbUri}/eventstore?authSource=admin`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => TypeOrmConfig as any,
    }),
    GamesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
