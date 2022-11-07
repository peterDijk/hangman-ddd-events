import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StoreEventPublisher } from '@peterdijk/nestjs-eventstoredb';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, Logger } from '@nestjs/common';
import { User } from '../../User.aggregate';
import { UserRepository } from '../../User.repository';
import { LogoutUserCommand } from '../LogoutUser.command';
import {
  CACHE_KEYS,
  CACHE_NO_EXPIRE,
} from '../../../../infrastructure/constants';

@CommandHandler(LogoutUserCommand)
export class LogoutUserHandler implements ICommandHandler<LogoutUserCommand> {
  private readonly logger = new Logger(LogoutUserHandler.name);

  constructor(
    private publisher: StoreEventPublisher,
    private repository: UserRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute({ user }: LogoutUserCommand): Promise<User> {
    const aggregate = await this.repository.findOneById(user.id);
    aggregate.logout();

    const loggedOutUser = this.publisher.mergeObjectContext(aggregate);

    loggedOutUser.commit();

    await this.cacheManager.set(
      `${CACHE_KEYS.AGGREGATE_KEY}-user-${user.id}`,
      loggedOutUser,
      CACHE_NO_EXPIRE,
    );

    return loggedOutUser;
  }
}
