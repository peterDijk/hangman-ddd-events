import { LetterGuessedUpdater } from './LetterGuessed.updater';
import { NewGameStartedUpdater } from './NewGameStarted.updater';
import { UserFullNameChangedUpdater } from './UserFullNameChanged.updater';

const StateUpdaters = [
  NewGameStartedUpdater,
  LetterGuessedUpdater,
  UserFullNameChangedUpdater,
];

export default StateUpdaters;
