import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { User } from './User.aggregate';
import { EventStore } from '@peterdijk/nestjs-eventstoredb';
import { Repository } from 'typeorm';
import { User as UserProjection } from '../../infrastructure/read-models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository {
  private readonly aggregate = 'user';

  constructor(
    private readonly eventStore: EventStore,
    @InjectRepository(UserProjection)
    private userProjectionRepository: Repository<UserProjection>,
  ) {}
  private logger = new Logger(UserRepository.name);

  async findOneById(aggregateId: string): Promise<User> {
    const user = new User(aggregateId);
    const { events } = await this.eventStore.getEvents(
      this.aggregate,
      aggregateId,
    );
    user.loadFromHistory(events);
    return user;
  }

  async findOneByUsername(username: string): Promise<User> {
    try {
      const { userId } = await this.userProjectionRepository.findOne({
        where: { username },
      });

      this.logger.debug(`findOneByUsername - ${userId}`);

      const user = new User(userId);

      const { events } = await this.eventStore.getEvents(
        this.aggregate,
        userId,
      );

      this.logger.debug(
        `got these events for found userid - ${JSON.stringify(events)}`,
      );

      user.loadFromHistory(events);

      this.logger.debug(
        `state of user after last event - ${JSON.stringify(user)}`,
      );
      return user;
    } catch (err) {
      throw new BadRequestException('no user found with username');
    }
  }
}
