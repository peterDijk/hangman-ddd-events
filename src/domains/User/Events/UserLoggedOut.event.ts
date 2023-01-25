import { StorableEvent } from '@peterdijk/nestjs-eventstoredb';

export class UserLoggedOutEvent extends StorableEvent {
  public readonly eventVersion = 1;
  aggregateName = 'user';

  constructor(public readonly id: string, public readonly dateLoggedOut: Date) {
    super();
  }
}
