import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StoreEventPublisher } from '@peterdijk/nestjs-eventstoredb';

import { Logger } from '@nestjs/common';
import { User } from '../../User.aggregate';
import { LoginUserCommand } from '../LoginUser.command';
import { UserRepository } from '../../User.repository';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  private readonly logger = new Logger(LoginUserHandler.name);

  constructor(
    private publisher: StoreEventPublisher,
    private userRepository: UserRepository,
  ) {}

  async execute({ username, password }: LoginUserCommand): Promise<User> {
    const aggregate = await this.userRepository.findOneByUsername(username);
    await aggregate.login(password);

    const user = this.publisher.mergeObjectContext(aggregate);

    user.commit();
    this.userRepository.updateOrCreate(user);
    return user;
  }
}
