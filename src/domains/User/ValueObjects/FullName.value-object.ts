import { IsString, MinLength, validateOrReject } from 'class-validator';
import { InvalidGameException } from '../../../infrastructure/exceptions';

import { ValueObject } from '../../common/ValueObject';

interface FullNameProps {
  value: string;
}

export class FullName extends ValueObject<FullNameProps> {
  @IsString()
  @MinLength(3)
  private _value: string;

  // Can't use the `new` keyword from outside the scope of the class.
  private constructor(props: FullNameProps) {
    super(props);

    // for validation using class-validator
    this._value = props.value;
  }

  get value(): string {
    return this.props.value;
  }

  public static async create(fullName: string): Promise<FullName> {
    try {
      const _fullName = new FullName({ value: fullName });
      await validateOrReject(_fullName);
      return _fullName;
    } catch (err) {
      throw new InvalidGameException(err);
    }
  }

  public static createReplay(fullName: string): FullName {
    return new FullName({ value: fullName });
  }
}
