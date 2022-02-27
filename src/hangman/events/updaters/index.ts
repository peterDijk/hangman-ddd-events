import { LetterGuessedUpdater } from './letter-guessed.updater';
import { NewGameStartedUpdater } from './new-game-started.updater';

const StateUpdaters = [NewGameStartedUpdater, LetterGuessedUpdater];

export default StateUpdaters;
