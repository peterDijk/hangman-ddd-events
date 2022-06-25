import { UserCreatedEvent } from './UserCreated.event';

export const UserEventSerializers = {
  UserCreatedEvent: ({ id, username, password, dateCreated, dateModified }) => {
    return new UserCreatedEvent(
      id,
      username,
      password,
      dateCreated,
      dateModified,
    );
  },
};
