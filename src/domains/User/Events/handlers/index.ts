import { UserCreatedEventHandler } from './UserCreated.handler';
import { UserLoggedInEventHandler } from './UserLoggedIn.handler';
import { UserLoggedOutEventHandler } from './UserLoggedOut.handler';
import { FullNameChangedEventHandler } from './FullNameChanged.handler';

export default [
  UserCreatedEventHandler,
  UserLoggedInEventHandler,
  UserLoggedOutEventHandler,
  FullNameChangedEventHandler,
];
