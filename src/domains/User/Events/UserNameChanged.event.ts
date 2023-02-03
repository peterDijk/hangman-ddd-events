import { StorableEvent } from '@peterdijk/nestjs-eventstoredb';

export class UserNameChangedEvent extends StorableEvent {
  public readonly eventVersion = 1;
  aggregateName = 'user';

  constructor(public readonly id: string, public readonly newUserName: string) {
    super();
  }
}
