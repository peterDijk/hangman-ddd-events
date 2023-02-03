import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventStoreModule } from '@peterdijk/nestjs-eventstoredb';
import { UserService } from '../services/user.service';
import { UserEventSerializers } from '../../domains/User/Events/UserEventSerializers';
import { UserResolver } from '../resolvers/user.resolver';
import UserProjectionUpdaters from '../../domains/User/Updaters/';
import UserCommandHandlers from '../../domains/User/Commands/handlers';
import UserEventHandlers from '../../domains/User/Events/handlers';
import { User as UserProjection } from '../read-models/user.entity';
import { Game as GameProjection } from '../read-models/game.entity';
import { UserRepository } from '../../domains/User/User.repository';
import { UsersController } from '../controllers/user.controller';
import { GamesRepository } from '../../domains/Game/Games.repository';

@Module({
  imports: [
    CqrsModule,
    EventStoreModule.forFeature({
      streamPrefix: 'user',
      eventSerializers: UserEventSerializers,
    }),
    TypeOrmModule.forFeature([UserProjection, GameProjection]),
  ],
  exports: [CqrsModule, UserRepository],
  controllers: [UsersController],
  providers: [
    UserResolver,
    UserService,
    GamesRepository,
    UserRepository,
    ...UserCommandHandlers,
    ...UserEventHandlers,
    ...UserProjectionUpdaters,
  ],
})
export class UserModule {}
