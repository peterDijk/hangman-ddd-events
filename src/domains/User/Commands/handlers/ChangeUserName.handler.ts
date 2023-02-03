import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StoreEventPublisher } from '@peterdijk/nestjs-eventstoredb';

import { Logger } from '@nestjs/common';
import { User } from '../../User.aggregate';
import { UserRepository } from '../../User.repository';
import { ChangeUserNameCommand } from '../ChangeUserName.command';

@CommandHandler(ChangeUserNameCommand)
export class ChangeUserNameHandler
  implements ICommandHandler<ChangeUserNameCommand>
{
  private readonly logger = new Logger(ChangeUserNameHandler.name);

  constructor(
    private publisher: StoreEventPublisher,
    private userRepository: UserRepository,
  ) {}

  async execute({ userId, newUsername }: ChangeUserNameCommand): Promise<User> {
    const aggregate = await this.userRepository.findOneById(userId);
    await aggregate.changeUsername(newUsername);

    const user = this.publisher.mergeObjectContext(aggregate);

    user.commit();
    this.userRepository.updateOrCreate(user);
    return user;
  }
}
