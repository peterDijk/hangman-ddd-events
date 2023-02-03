import { UserCreatedEventHandler } from './UserCreated.handler';
import { UserLoggedInEventHandler } from './UserLoggedIn.handler';
import { UserLoggedOutEventHandler } from './UserLoggedOut.handler';
import { UserNameChangedEventHandler } from './UserNameChanged.handler';

export default [
  UserCreatedEventHandler,
  UserLoggedInEventHandler,
  UserLoggedOutEventHandler,
  UserNameChangedEventHandler,
];
