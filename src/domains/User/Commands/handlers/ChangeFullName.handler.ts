import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StoreEventPublisher } from '@peterdijk/nestjs-eventstoredb';

import { Logger } from '@nestjs/common';
import { User } from '../../User.aggregate';
import { UserRepository } from '../../User.repository';
import { ChangeFullNameCommand } from '../ChangeFullName.command';

@CommandHandler(ChangeFullNameCommand)
export class ChangeFullNameHandler
  implements ICommandHandler<ChangeFullNameCommand>
{
  private readonly logger = new Logger(ChangeFullNameHandler.name);

  constructor(
    private publisher: StoreEventPublisher,
    private userRepository: UserRepository,
  ) {}

  async execute({ user, newFullName }: ChangeFullNameCommand): Promise<User> {
    await user.changeFullName(newFullName);

    const updatedUser = this.publisher.mergeObjectContext(user);

    updatedUser.commit();
    this.userRepository.updateOrCreate(updatedUser);
    return updatedUser;
  }
}
