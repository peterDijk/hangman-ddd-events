import { AggregateRoot } from '@nestjs/cqrs';
import { UserCreatedEvent } from './Events/UserCreated.event';
import { Password } from './ValueObjects/Password.value-object';
import { Username } from './ValueObjects/Username.value-object';

export class User extends AggregateRoot {
  public readonly id: string;

  dateCreated: Date;
  dateModified: Date;

  userName: Username;
  password: Password;

  constructor(id: string) {
    super();
    this.id = id;
  }

  async create(username: string, password: string) {
    this.userName = await Username.create(username);
    this.password = await Password.create(password);
    this.dateCreated = new Date();
    this.dateModified = new Date();

    try {
      this.apply(
        new UserCreatedEvent(
          this.id,
          this.userName.value,
          this.password.value,
          this.dateCreated,
          this.dateModified,
        ),
      );
    } catch (err) {
      throw new Error(err);
    }
  }

  onUserCreatedEvent(event: UserCreatedEvent) {
    this.userName = Username.createReplay(event.userName);
    this.password = Password.createReplay(event.password);
    this.dateCreated = event.dateCreated;
    this.dateModified = event.dateModified;
  }
}
