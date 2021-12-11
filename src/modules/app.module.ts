import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import TypeOrmConfig from '../../ormconfig';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from '../controllers/app.controller';
import { AppService } from '../Hangman/Application/Services/app.service';
import { GamesModule } from './game.module';
import { config } from '../../config';
import { EventSourcingModule } from './eventstore.module';
// import { EventBus } from '../Hangman/Infrastructure/EventStore/EventBus';

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
      eventStoreUrl: 'esdb://eventstore.db:2113?tls=false',
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
