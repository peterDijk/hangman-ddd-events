import { UserCreatedEvent } from './UserCreated.event';
import { UserLoggedInEvent } from './UserLoggedIn.event';
import { UserLoggedOutEvent } from './UserLoggedOut.event';

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
  UserLoggedInEvent: ({ id, dateLoggedIn }) => {
    return new UserLoggedInEvent(id, dateLoggedIn);
  },
  UserLoggedOutEvent: ({ id, dateLoggedOut }) => {
    return new UserLoggedOutEvent(id, dateLoggedOut);
  },
};
