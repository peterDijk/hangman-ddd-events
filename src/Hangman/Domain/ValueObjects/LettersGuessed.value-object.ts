import { IsString, max, validateOrReject } from 'class-validator';
import { isType } from 'graphql';
import { InvalidGameException } from '../../Exceptions';
import { Letter } from './Letter.value-object';
import { MaxGuesses } from './MaxGuesses.value-object';

import { ValueObject } from './ValueObject';

interface LettersGuessedProps {
  value: Letter[];
}

export class LettersGuessed extends ValueObject<LettersGuessedProps> {
  // Can't use the `new` keyword from outside the scope of the class.
  private constructor(props: LettersGuessedProps) {
    super(props);
  }

  get value(): Letter[] {
    return this.props.value;
  }

  public static async create(
    lettersGuessed: Letter[],
    maxGuesses: MaxGuesses,
  ): Promise<LettersGuessed> {
    try {
      if (lettersGuessed.length > maxGuesses.value) {
        throw new InvalidGameException(`Max guesses, game over`);
      }
      const guessed = new LettersGuessed({ value: lettersGuessed });
      return guessed;
    } catch (err) {
      throw new InvalidGameException(err);
    }
  }

  public static createReplay(lettersGuessed: Letter[]): LettersGuessed {
    return new LettersGuessed({ value: lettersGuessed });
  }
}
