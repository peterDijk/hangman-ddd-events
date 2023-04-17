import { UserCreatedUpdater } from './UserCreated.updater';
import { UserLoggedInUpdater } from './UserLoggedIn.updater';
import { FullNameChangedUpdater } from './FullNameChanged.updater';

const StateUpdaters = [
  UserCreatedUpdater,
  UserLoggedInUpdater,
  FullNameChangedUpdater,
];

export default StateUpdaters;
