import { IsNumber, Min, validateOrReject } from 'class-validator';
import { InvalidGameException } from '../../Exceptions';

import { ValueObject } from './ValueObject';

interface WordProps {
  value: number;
}

export class MaxGuesses extends ValueObject<WordProps> {
  @IsNumber()
  @Min(3)
  private _value: number;

  // Can't use the `new` keyword from outside the scope of the class.
  private constructor(props: WordProps) {
    super(props);

    // for validation using class-validator
    this._value = props.value;
  }

  get value(): number {
    return this.props.value;
  }

  public static async create(guesses: number): Promise<MaxGuesses> {
    try {
      const word = new MaxGuesses({ value: guesses });
      await validateOrReject(word);
      return word;
    } catch (err) {
      throw new InvalidGameException(err);
    }
  }

  public static createReplay(wordToGuess: number): MaxGuesses {
    return new MaxGuesses({ value: wordToGuess });
  }
}
