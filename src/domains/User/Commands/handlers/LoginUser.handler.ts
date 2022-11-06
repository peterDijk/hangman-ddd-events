import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StoreEventPublisher } from '@peterdijk/nestjs-eventstoredb';

import { Logger } from '@nestjs/common';
import { CreateNewUserCommand } from '../CreateNewUser.command';
import { User } from '../../User.aggregate';
import { LoginUserCommand } from '../LoginUser.command';
import { UserRepository } from '../../User.repository';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  private readonly logger = new Logger(LoginUserHandler.name);

  constructor(
    private publisher: StoreEventPublisher,
    private repository: UserRepository,
  ) {}

  async execute({
    username,
    password,
    jwtService,
  }: LoginUserCommand): Promise<User> {
    const aggregate = await this.repository.findOneByUsername(username);
    await aggregate.login(password, jwtService);

    const user = this.publisher.mergeObjectContext(aggregate);

    user.commit();

    return user;
  }
}
