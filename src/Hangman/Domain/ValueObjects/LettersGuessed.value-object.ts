import { IsString, validateOrReject } from 'class-validator';
import { InvalidGameException } from '../../Exceptions';

import { ValueObject } from './ValueObject';

interface LettersGuessedProps {
  value: string[];
}

export class LettersGuessed extends ValueObject<LettersGuessedProps> {
  @IsString({ each: true })
  private _value: string[];

  // Can't use the `new` keyword from outside the scope of the class.
  private constructor(props: LettersGuessedProps) {
    super(props);

    // for validation using class-validator
    this._value = props.value;
  }

  get value(): string[] {
    return this.props.value;
  }

  public static async create(
    lettersGuessed: string[],
  ): Promise<LettersGuessed> {
    try {
      const guessed = new LettersGuessed({ value: lettersGuessed });
      await validateOrReject(guessed);
      return guessed;
    } catch (err) {
      throw new InvalidGameException(err);
    }
  }

  public static createReplay(lettersGuessed: string[]): LettersGuessed {
    return new LettersGuessed({ value: lettersGuessed });
  }
}
