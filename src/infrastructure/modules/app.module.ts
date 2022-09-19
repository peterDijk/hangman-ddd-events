import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import TypeOrmConfig, { AppDataSource } from '../../../ormconfig';
import { GraphQLModule } from '@nestjs/graphql';
import { EventStoreModule } from '@peterdijk/nestjs-eventstoredb';

import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { GamesModule } from './game.module';
import { config } from '../../../config';
import { UserModule } from './user.module';
import { AppResolver } from '../resolvers/app.resolver';

export const mongoDbUri = `${config.STORE_STATE_SETTINGS.type}://${config.STORE_STATE_SETTINGS.credentials.username}:${config.STORE_STATE_SETTINGS.credentials.password}@${config.STORE_STATE_SETTINGS.hostname}:${config.STORE_STATE_SETTINGS.port}`;
@Module({
  imports: [
    // AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      introspection: config.GQL_PLAYGROUND,
      playground: config.GQL_PLAYGROUND,
      cors: true,
    }),
    EventStoreModule.forRoot({
      address: config.EVENT_STORE_SETTINGS.hostname,
      port: config.EVENT_STORE_SETTINGS.httpPort,
      insecure: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => TypeOrmConfig as any,
      // dataSource receives the configured DataSourceOptions
      // and returns a Promise<DataSource>.
      // dataSourceFactory: async (options) => {
      //   const dataSource = await AppDataSource.initialize();
      //   return dataSource;
      // },
    }),
    GamesModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppResolver, AppService],
})
export class AppModule {}
