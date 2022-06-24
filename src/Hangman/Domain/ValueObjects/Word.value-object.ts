import {
  IsString,
  validateOrReject,
  IsNumber,
  MinLength,
  Min,
} from 'class-validator';
import { InvalidGameException } from '../../Exceptions';

import { ValueObject } from './ValueObject';

interface WordProps {
  value: string;
}

export class Word extends ValueObject<WordProps> {
  // @IsString()
  // @MinLength(3)
  // private _value: string;

  // Can't use the `new` keyword from outside the scope of the class.
  private constructor(props: WordProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(wordToGuess: string): Word {
    try {
      // await validateOrReject(this);
      return new Word({ value: wordToGuess });
    } catch (err) {
      throw new InvalidGameException(err);
    }
  }
}
