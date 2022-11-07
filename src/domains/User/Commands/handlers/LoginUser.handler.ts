import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StoreEventPublisher } from '@peterdijk/nestjs-eventstoredb';

import { CACHE_MANAGER, Inject, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { User } from '../../User.aggregate';
import { LoginUserCommand } from '../LoginUser.command';
import { UserRepository } from '../../User.repository';
import {
  CACHE_KEYS,
  CACHE_NO_EXPIRE,
} from '../../../../infrastructure/constants';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  private readonly logger = new Logger(LoginUserHandler.name);

  constructor(
    private publisher: StoreEventPublisher,
    private repository: UserRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute({ username, password }: LoginUserCommand): Promise<User> {
    const aggregate = await this.repository.findOneByUsername(username);
    await aggregate.login(password);

    const user = this.publisher.mergeObjectContext(aggregate);

    user.commit();

    await this.cacheManager.set(
      `${CACHE_KEYS.AGGREGATE_KEY}-${user.aggregateName}-${user.id}`,
      user,
      3600,
    );

    const cacheKeyUserId = `${CACHE_KEYS.CACHE_ID_BY_USERNAME_KEY}-${user.userName.value}`;
    this.logger.debug({ cacheKeyUserId, 'user.id': user.id });
    await this.cacheManager.set(cacheKeyUserId, user.id, 3600);

    const result = await this.cacheManager.get(cacheKeyUserId);

    this.logger.debug({ result });

    return user;
  }
}
