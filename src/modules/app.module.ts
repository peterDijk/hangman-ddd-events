import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import TypeOrmConfig, { AppDataSource } from '../../ormconfig';
import { GraphQLModule } from '@nestjs/graphql';
import { EventStoreModule } from '@peterdijk/nestjs-eventstoredb';

import { AppController } from '../controllers/app.controller';
import { AppService } from '../Hangman/Application/Services/app.service';
import { GamesModule } from './game.module';
import { config } from '../../config';
import { UserModule } from './user.module';
import { AppResolver } from '../resolvers/app.resolver';
import { CqrsModule } from '@nestjs/cqrs';

export const mongoDbUri = `${config.STORE_STATE_SETTINGS.type}://${config.STORE_STATE_SETTINGS.credentials.username}:${config.STORE_STATE_SETTINGS.credentials.password}@${config.STORE_STATE_SETTINGS.hostname}:${config.STORE_STATE_SETTINGS.port}`;
@Module({
  imports: [
    // AuthModule,
    // GraphQLModule.forRoot({
    //   driver: ,
    //   autoSchemaFile: 'schema.gql',
    //   introspection: process.env.GQL_PLAYGROUND === 'enabled' ? true : false,
    //   playground: process.env.GQL_PLAYGROUND === 'enabled' ? true : false,
    //   cors: true,
    // }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      introspection: process.env.GQL_PLAYGROUND === 'enabled' ? true : false,
      playground: process.env.GQL_PLAYGROUND === 'enabled' ? true : false,
      cors: true,
    }),
    EventStoreModule.forRoot({
      eventStoreUrl: `esdb://${config.EVENT_STORE_SETTINGS.hostname}:${config.EVENT_STORE_SETTINGS.httpPort}?tls=false`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => TypeOrmConfig as any,
      // dataSource receives the configured DataSourceOptions
      // and returns a Promise<DataSource>.
      dataSourceFactory: async (options) => {
        const dataSource = await AppDataSource.initialize();
        return dataSource;
      },
    }),
    GamesModule,
    // UserModule,
  ],
  controllers: [AppController],
  providers: [AppResolver, AppService],
})
export class AppModule {}
