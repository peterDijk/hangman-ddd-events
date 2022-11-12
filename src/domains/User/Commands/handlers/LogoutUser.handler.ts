import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StoreEventPublisher } from '@peterdijk/nestjs-eventstoredb';
import { Logger } from '@nestjs/common';
import { User } from '../../User.aggregate';
import { UserRepository } from '../../User.repository';
import { LogoutUserCommand } from '../LogoutUser.command';

@CommandHandler(LogoutUserCommand)
export class LogoutUserHandler implements ICommandHandler<LogoutUserCommand> {
  private readonly logger = new Logger(LogoutUserHandler.name);

  constructor(
    private publisher: StoreEventPublisher,
    private userRepository: UserRepository,
  ) {}

  async execute({ user }: LogoutUserCommand): Promise<User> {
    const aggregate = await this.userRepository.findOneById(user.id);
    aggregate.logout();

    const loggedOutUser = this.publisher.mergeObjectContext(aggregate);

    loggedOutUser.commit();

    this.userRepository.updateOrCreate(loggedOutUser);
    return loggedOutUser;
  }
}
