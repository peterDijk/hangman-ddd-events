import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StoreEventPublisher } from '@peterdijk/nestjs-eventstoredb';

import { BadRequestException, Logger } from '@nestjs/common';
import { CreateNewUserCommand } from '../CreateNewUser.command';
import { User } from '../../User.aggregate';
import { UserRepository } from '../../User.repository';

@CommandHandler(CreateNewUserCommand)
export class CreateNewUserHandler
  implements ICommandHandler<CreateNewUserCommand>
{
  private readonly logger = new Logger(CreateNewUserHandler.name);

  constructor(
    private publisher: StoreEventPublisher,
    private userRepository: UserRepository,
  ) {}

  async execute({ data, uuid }: CreateNewUserCommand) {
    // validate username
    const alreadyExists = await this.userRepository.findOneByUsername(
      data.username,
    );

    if (alreadyExists) {
      throw new BadRequestException('username already exists');
    }

    const aggregate = new User(uuid);
    await aggregate.create(data.username, data.password, data.fullName);
    const user = this.publisher.mergeObjectContext(aggregate);
    user.commit();
    this.userRepository.updateOrCreate(user);
  }
}
