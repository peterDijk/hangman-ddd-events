import { StorableEvent } from '@peterdijk/nestjs-eventstoredb';

export class UserCreatedEvent extends StorableEvent {
  public readonly eventVersion = 1;
  aggregateName = 'user';

  constructor(
    public readonly id: string,
    public readonly userName: string,
    public readonly password: string,
    public readonly fullName: string,
    public readonly dateCreated: Date,
    public readonly dateModified: Date,
  ) {
    super();
  }
}
