import { redisStore } from 'cache-manager-redis-yet';
import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
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

@Module({
  imports: [
    CacheModule.registerAsync<any>({
      isGlobal: true,
      useFactory: async () => {
        const store = await redisStore({
          url: `redis://${config.REDIS_SETTINGS.host}:${config.REDIS_SETTINGS.port}`,
          ttl: 0,
        });
        return {
          store: () => store,
        };
      },
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
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: process.env.MONGO_HOST,
      port: parseInt(process.env.MONGO_CONTAINER_PORT),
      username: process.env.MONGO_USER,
      password: process.env.MONGO_PASSWORD,
      database: process.env.MONGO_DB,
      useUnifiedTopology: true,
      synchronize: true,
      logger: 'debug',
      autoLoadEntities: true,
    }),
    GamesModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppResolver, AppService],
})
export class AppModule {}
