import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventStoreModule } from '@peterdijk/nestjs-eventstoredb';
import { UserService } from '../Hangman/Application/Services/user.service';
import { UserEventSerializers } from '../Hangman/Domain/Events/UserEventSerializers';
import { UserResolver } from '../resolvers/user.resolver';
import UserProjectionUpdaters from '../Hangman/Domain/Updaters/User.updaters';
import UserCommandHandlers from '../Hangman/Application/CommandHandlers/user.commandhandlers';
import { User as UserProjection } from '../Hangman/ReadModels/user.entity';

@Module({
  imports: [
    CqrsModule,
    EventStoreModule.forFeature({
      streamPrefix: 'user',
      eventSerializers: UserEventSerializers,
    }),
    TypeOrmModule.forFeature([UserProjection]),
  ],
  exports: [CqrsModule],
  // controllers: [UserController],
  providers: [
    UserResolver,
    UserService,
    ...UserCommandHandlers,
    // ...UserEventHandlers,
    // ...UserProjectionUpdaters,
  ],
})
export class UserModule {}
