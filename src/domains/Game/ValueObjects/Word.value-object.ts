import { IsString, validateOrReject, MinLength } from 'class-validator';
import { InvalidGameException } from '../../../infrastructure/exceptions';

import { ValueObject } from '../../common/ValueObject';

interface WordProps {
  value: string;
}

export class Word extends ValueObject<WordProps> {
  @IsString()
  @MinLength(5)
  private _value: string;

  // Can't use the `new` keyword from outside the scope of the class.
  private constructor(props: WordProps) {
    super(props);

    // for validation using class-validator
    this._value = props.value;
  }

  get value(): string {
    return this.props.value;
  }

  public static async create(wordToGuess: string): Promise<Word> {
    try {
      const word = new Word({ value: wordToGuess });
      await validateOrReject(word);
      return word;
    } catch (err) {
      throw new InvalidGameException(err);
    }
  }

  public static createReplay(wordToGuess: string): Word {
    return new Word({ value: wordToGuess });
  }
}
