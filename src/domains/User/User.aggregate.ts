import { AggregateRoot } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { UserCreatedEvent } from './Events/UserCreated.event';
import { Password } from './ValueObjects/Password.value-object';
import { Username } from './ValueObjects/Username.value-object';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { UserLoggedInEvent } from './Events/UserLoggedIn.event';
import { UserLoggedOutEvent } from './Events/UserLoggedOut.event';
import { createToken } from '../../helpers/createToken';

export class User extends AggregateRoot {
  private readonly logger = new Logger(User.name);

  public readonly id: string;

  dateCreated: Date;
  dateModified: Date;

  userName: Username;
  password: Password;

  lastLoggedIn: Date;
  numberLogins: number;
  currentlyLoggedIn: boolean;
  loginToken: string; // other type?

  constructor(id: string) {
    super();
    this.id = id;
  }

  async create(username: string, password: string) {
    this.userName = await Username.create(username);
    this.password = await Password.create(password);
    this.dateCreated = new Date();
    this.dateModified = new Date();

    try {
      this.apply(
        new UserCreatedEvent(
          this.id,
          this.userName.value,
          this.password.value,
          this.dateCreated,
          this.dateModified,
        ),
      );
    } catch (err) {
      throw new Error(err);
    }
  }

  async login(password: string, jwtService: JwtService) {
    const areEqual = await bcrypt.compare(password, this.password.value);

    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const { accessToken } = createToken(this.userName.value, jwtService);

    this.lastLoggedIn = new Date();
    this.numberLogins++;
    this.currentlyLoggedIn = true;
    this.loginToken = accessToken;

    this.apply(new UserLoggedInEvent(this.id, new Date()));
  }

  logout() {
    this.currentlyLoggedIn = false;

    // invalidate login token
    this.loginToken = undefined;

    this.apply(new UserLoggedOutEvent(this.id, new Date()));
  }

  onUserCreatedEvent(event: UserCreatedEvent) {
    this.userName = Username.createReplay(event.userName);
    this.password = Password.createReplay(event.password);
    this.dateCreated = event.dateCreated;
    this.dateModified = event.dateModified;
  }

  onUserLogginInEvent(event: UserLoggedInEvent) {
    this.lastLoggedIn = event.dateLoggedIn;
    this.numberLogins++;
    this.currentlyLoggedIn = false; // on replay we don't want to store the user is currently logged in right
  }

  onUserLoggedOutEvent(event: UserLoggedOutEvent) {
    this.logger.debug(`onUserLoggedOutEvent - ${JSON.stringify(event)}`);
  }
}
