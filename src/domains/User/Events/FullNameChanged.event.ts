import { StorableEvent } from '@peterdijk/nestjs-eventstoredb';

export class FullNameChangedEvent extends StorableEvent {
  public readonly eventVersion = 1;
  aggregateName = 'user';

  constructor(public readonly id: string, public readonly newFullName: string) {
    super();
  }
}
