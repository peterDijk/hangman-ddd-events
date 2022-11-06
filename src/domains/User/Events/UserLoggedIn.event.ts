import { StorableEvent } from '@peterdijk/nestjs-eventstoredb';

export class UserLoggedInEvent extends StorableEvent {
  public readonly eventVersion = 1;
  aggregateName = 'user';

  constructor(
    public readonly id: string,
    public readonly dateLoggedIn: Date,
    public numberLogins: number,
    public dateModified: Date,
  ) {
    super();
  }
}
