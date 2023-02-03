import { UserCreatedUpdater } from './UserCreated.updater';
import { UserLoggedInUpdater } from './UserLoggedIn.updater';
import { UserNameChangedUpdater } from './UserNameChanged.updater';

const StateUpdaters = [
  UserCreatedUpdater,
  UserLoggedInUpdater,
  UserNameChangedUpdater,
];

export default StateUpdaters;
