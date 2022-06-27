import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import TypeOrmConfig from '../../ormconfig';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { EventStoreModule } from '@peterdijk/nestjs-eventstoredb';

import { AppController } from '../controllers/app.controller';
import { AppService } from '../Hangman/Application/Services/app.service';
import { GamesModule } from './game.module';
import { config } from '../../config';
import { UserModule } from './user.module';

// export const mongoDbUri = `${config.MONGO_PROJECTION_DB_SETTINGS.type}://${config.MONGO_PROJECTION_DB_SETTINGS.credentials.username}:${config.MONGO_PROJECTION_DB_SETTINGS.credentials.password}@${config.MONGO_PROJECTION_DB_SETTINGS.hostname}:${config.MONGO_PROJECTION_DB_SETTINGS.port}`;
@Module({
  imports: [
    // AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: 'schema.gql',
      introspection: process.env.GQL_PLAYGROUND === 'enabled' ? true : false,
      playground: process.env.GQL_PLAYGROUND === 'enabled' ? true : false,
      cors: true,
      driver: ApolloDriver,
    }),
    EventStoreModule.forRoot({
      eventStoreUrl: `esdb://${config.EVENT_STORE_SETTINGS.hostname}:${config.EVENT_STORE_SETTINGS.httpPort}?tls=false`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const config = TypeOrmConfig as any;
        console.log({ config });
        return config;
      },
    }),
    // TypeOrmModule.forRoot({
    //   type: 'mongodb',
    //   host: 'mongodb',
    //   port: 27017,
    //   username: 'root',
    //   password: 'example',
    //   authSource: 'admin',
    //   database: 'test',
    //   entities: [],
    //   synchronize: true,
    // }),
    GamesModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
