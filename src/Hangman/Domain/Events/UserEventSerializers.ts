import { UserCreatedEvent } from './UserCreated.event';

export const UserEventSerializers = {
  UserCreatedEvent: ({ id, userName, password, dateCreated, dateModified }) => {
    return new UserCreatedEvent(
      id,
      userName,
      password,
      dateCreated,
      dateModified,
    );
  },
};
