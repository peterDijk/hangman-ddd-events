import { LetterGuessedUpdater } from './LetterGuessed.updater';
import { NewGameStartedUpdater } from './NewGameStarted.updater';

const StateUpdaters = [NewGameStartedUpdater, LetterGuessedUpdater];

export default StateUpdaters;
