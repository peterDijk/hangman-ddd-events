import { IsNumber, Min, validateOrReject } from 'class-validator';
import { InvalidGameException } from '../../Exceptions';

import { ValueObject } from './ValueObject';

interface MaxGuessesProps {
  value: number;
}

export class MaxGuesses extends ValueObject<MaxGuessesProps> {
  @IsNumber()
  @Min(3)
  private _value: number;

  // Can't use the `new` keyword from outside the scope of the class.
  private constructor(props: MaxGuessesProps) {
    super(props);

    // for validation using class-validator
    this._value = props.value;
  }

  get value(): number {
    return this.props.value;
  }

  public static async create(guesses: number): Promise<MaxGuesses> {
    try {
      const max = new MaxGuesses({ value: guesses });
      await validateOrReject(max);
      return max;
    } catch (err) {
      throw new InvalidGameException(err);
    }
  }

  public static createReplay(wordToGuess: number): MaxGuesses {
    return new MaxGuesses({ value: wordToGuess });
  }
}
