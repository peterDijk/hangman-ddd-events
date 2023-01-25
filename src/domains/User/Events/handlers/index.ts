import { UserLoggedInEvent } from '../UserLoggedIn.event';
import { UserLoggedOutEvent } from '../UserLoggedOut.event';
import { UserCreatedEventHandler } from './UserCreated.handler';
import { UserLoggedInEventHandler } from './UserLoggedIn.handler';
import { UserLoggedOutEventHandler } from './UserLoggedOut.handler';

export default [
  UserCreatedEventHandler,
  UserLoggedInEventHandler,
  UserLoggedOutEventHandler,
];
