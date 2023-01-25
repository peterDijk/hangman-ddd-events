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
import { UserRepository } from '../../domains/User/User.repository';
import { UsersController } from '../controllers/user.controller';

@Module({
  imports: [
    CqrsModule,
    EventStoreModule.forFeature({
      streamPrefix: 'user',
      eventSerializers: UserEventSerializers,
    }),
    TypeOrmModule.forFeature([UserProjection]),
  ],
  exports: [CqrsModule, UserRepository],
  controllers: [UsersController],
  providers: [
    UserResolver,
    UserService,
    UserRepository,
    ...UserCommandHandlers,
    ...UserEventHandlers,
    ...UserProjectionUpdaters,
  ],
})
export class UserModule {}
