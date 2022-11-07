import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { options } from '../../../ormconfig';
import { GraphQLModule } from '@nestjs/graphql';
import { EventStoreModule } from '@peterdijk/nestjs-eventstoredb';

import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { GamesModule } from './game.module';
import { config } from '../../../config';
import { UserModule } from './user.module';
import { AuthModule } from './auth.module';
import { AppResolver } from '../resolvers/app.resolver';
import { MongoPositionStore } from '../../mongo/mongo-eventstore-adapter';

export const mongoDbUri = `${config.STORE_STATE_SETTINGS.type}://${config.STORE_STATE_SETTINGS.credentials.username}:${config.STORE_STATE_SETTINGS.credentials.password}@${config.STORE_STATE_SETTINGS.hostname}:${config.STORE_STATE_SETTINGS.port}`;
@Module({
  imports: [
    CacheModule.register({
      ttl: 3600 * 4,
      max: 1000 * 1000,
      isGlobal: true,
    }),
    AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      introspection: config.GQL_PLAYGROUND,
      playground: config.GQL_PLAYGROUND,
      cors: true,
    }),
    EventStoreModule.forRootAsync({
      address: config.EVENT_STORE_SETTINGS.hostname,
      port: config.EVENT_STORE_SETTINGS.httpPort,
      insecure: true,
      lastPositionStorageFactory: MongoPositionStore,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => options as any,
    }),
    GamesModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppResolver, AppService],
  // exports: [CacheModule],
})
export class AppModule {}
