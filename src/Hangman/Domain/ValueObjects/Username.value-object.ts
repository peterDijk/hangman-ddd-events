import { IsString, MinLength, validateOrReject } from 'class-validator';
import { InvalidGameException } from '../../Exceptions';

import { ValueObject } from './ValueObject';

interface UsernameProps {
  value: string;
}

export class Username extends ValueObject<UsernameProps> {
  @IsString()
  @MinLength(3)
  private _value: string;

  // Can't use the `new` keyword from outside the scope of the class.
  private constructor(props: UsernameProps) {
    super(props);

    // for validation using class-validator
    this._value = props.value;
  }

  get value(): string {
    return this.props.value;
  }

  public static async create(username: string): Promise<Username> {
    try {
      const _username = new Username({ value: username });
      await validateOrReject(_username);
      return _username;
    } catch (err) {
      throw new InvalidGameException(err);
    }
  }

  public static createReplay(username: string): Username {
    return new Username({ value: username });
  }
}
