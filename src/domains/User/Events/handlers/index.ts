import { UserLoggedInEvent } from '../UserLoggedIn.event';
import { UserLoggedOutEvent } from '../UserLoggedOut.event';
import { UserCreatedEventEventHandler } from './UserCreated.handler';

export default [
  UserCreatedEventEventHandler,
  UserLoggedInEvent,
  UserLoggedOutEvent,
];
