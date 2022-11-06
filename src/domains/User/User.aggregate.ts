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

  constructor(id: string) {
    super();
    this.id = id;
    this.numberLogins = 0;
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

  async login(password: string) {
    const areEqual = await bcrypt.compare(password, this.password.value);

    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    this.lastLoggedIn = new Date();
    this.numberLogins++;
    this.currentlyLoggedIn = true;

    this.apply(new UserLoggedInEvent(this.id, new Date()));
  }

  logout() {
    this.currentlyLoggedIn = false;

    this.apply(new UserLoggedOutEvent(this.id, new Date()));
  }

  onUserCreatedEvent(event: UserCreatedEvent) {
    this.userName = Username.createReplay(event.userName);
    this.password = Password.createReplay(event.password);
    this.dateCreated = event.dateCreated;
    this.dateModified = event.dateModified;
  }

  onUserLoggedInEvent(event: UserLoggedInEvent) {
    this.logger.debug(`onUserLoggedInEvent - ${JSON.stringify(event)}`);
    this.lastLoggedIn = event.dateLoggedIn;
    this.numberLogins++;
    this.currentlyLoggedIn = true; // for validateUser we replay all events to see if the user is currently logged in
  }

  onUserLoggedOutEvent(event: UserLoggedOutEvent) {
    this.logger.debug(`onUserLoggedOutEvent - ${JSON.stringify(event)}`);
    this.currentlyLoggedIn = false;
  }
}
