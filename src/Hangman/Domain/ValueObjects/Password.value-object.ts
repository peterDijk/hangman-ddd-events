import * as bcrypt from 'bcrypt';
import { InvalidGameException } from '../../Exceptions';

import { ValueObject } from './ValueObject';

interface PasswordProps {
  value: string;
}

export class Password extends ValueObject<PasswordProps> {
  // Can't use the `new` keyword from outside the scope of the class.
  private constructor(props: PasswordProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static async create(password: string): Promise<Password> {
    try {
      if (password.length < 3) {
        throw new Error('password has to have length of 3');
      }
      const encryptedPW = await bcrypt.hash(password, 10);
      const _password = new Password({ value: encryptedPW });
      return _password;
    } catch (err) {
      throw new InvalidGameException(err);
    }
  }

  public static createReplay(encryptedPassword: string): Password {
    return new Password({ value: encryptedPassword });
  }
}
