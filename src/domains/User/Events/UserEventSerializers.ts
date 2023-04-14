import { UserCreatedEvent } from './UserCreated.event';
import { UserLoggedInEvent } from './UserLoggedIn.event';
import { UserLoggedOutEvent } from './UserLoggedOut.event';
import { FullNameChangedEvent } from './FullNameChanged.event';

export const UserEventSerializers = {
  UserCreatedEvent: ({
    id,
    userName,
    password,
    fullName,
    dateCreated,
    dateModified,
  }) => {
    return new UserCreatedEvent(
      id,
      userName,
      password,
      fullName,
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
  FullNameChangedEvent: ({ id, newFullName }) => {
    return new FullNameChangedEvent(id, newFullName);
  },
};
