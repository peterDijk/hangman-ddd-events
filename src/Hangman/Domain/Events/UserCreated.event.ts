import { StorableEvent } from '@peterdijk/nestjs-eventstoredb';
import { Password } from '../ValueObjects/Password.value-object';
import { Username } from '../ValueObjects/Username.value-object';

export class UserCreatedEvent extends StorableEvent {
  public readonly eventVersion = 1;

  constructor(
    public readonly id: string,
    public readonly userName: Username,
    public readonly password: Password,
    public readonly dateCreated: Date,
    public readonly dateModified: Date,
  ) {
    super();
  }
}
