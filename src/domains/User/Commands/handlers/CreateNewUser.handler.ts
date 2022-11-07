import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StoreEventPublisher } from '@peterdijk/nestjs-eventstoredb';

import { Logger } from '@nestjs/common';
import { CreateNewUserCommand } from '../CreateNewUser.command';
import { User } from '../../User.aggregate';

@CommandHandler(CreateNewUserCommand)
export class CreateNewUserHandler
  implements ICommandHandler<CreateNewUserCommand>
{
  private readonly logger = new Logger(CreateNewUserHandler.name);

  constructor(private publisher: StoreEventPublisher) {}

  async execute({ data, uuid }: CreateNewUserCommand) {
    const aggregate = new User(uuid);
    await aggregate.create(data.username, data.password);

    const user = this.publisher.mergeObjectContext(aggregate);

    user.commit();
  }
}
