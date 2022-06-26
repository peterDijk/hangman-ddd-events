import { Logger } from '@nestjs/common';
import {
  IsString,
  MaxLength,
  MinLength,
  validateOrReject,
} from 'class-validator';
import { InvalidGameException } from '../../Exceptions';

import { ValueObject } from './ValueObject';

interface LetterProps {
  value: string;
}

export class Letter extends ValueObject<LetterProps> {
  @IsString()
  @MinLength(1)
  @MaxLength(1)
  private _value: string;

  private logger = new Logger(Letter.name);

  // Can't use the `new` keyword from outside the scope of the class.
  private constructor(props: LetterProps) {
    super(props);

    // for validation using class-validator
    this._value = props.value;
  }

  get value(): string {
    return this.props.value;
  }

  public static async create(letter: string): Promise<Letter> {
    try {
      const guessed = new Letter({ value: letter });
      await validateOrReject(guessed);
      return guessed;
    } catch (err) {
      throw new InvalidGameException(err);
    }
  }

  public static createReplay(letter: string): Letter {
    return new Letter({ value: letter });
  }
}
