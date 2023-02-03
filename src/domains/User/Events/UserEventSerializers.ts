import { UserCreatedEvent } from './UserCreated.event';
import { UserLoggedInEvent } from './UserLoggedIn.event';
import { UserLoggedOutEvent } from './UserLoggedOut.event';
import { UserNameChangedEvent } from './UserNameChanged.event';

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
  UserLoggedInEvent: ({
    id,
    userName,
    dateLoggedIn,
    numberLogins,
    dateModified,
  }) => {
    return new UserLoggedInEvent(
      id,
      userName,
      dateLoggedIn,
      numberLogins,
      dateModified,
    );
  },
  UserLoggedOutEvent: ({ id, dateLoggedOut }) => {
    return new UserLoggedOutEvent(id, dateLoggedOut);
  },
  UserNameChangedEvent: ({ id, newUserName }) => {
    return new UserNameChangedEvent(id, newUserName);
  },
};
