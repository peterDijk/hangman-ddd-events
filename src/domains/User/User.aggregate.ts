import { AggregateRoot } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { UserCreatedEvent } from './Events/UserCreated.event';
import { Password } from './ValueObjects/Password.value-object';
import { Username } from './ValueObjects/Username.value-object';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { UserLoggedInEvent } from './Events/UserLoggedIn.event';
import { UserLoggedOutEvent } from './Events/UserLoggedOut.event';
import { FullName } from './ValueObjects/FullName.value-object';
import { FullNameChangedEvent } from './Events/FullNameChanged.event';

export class User extends AggregateRoot {
  private readonly logger = new Logger(User.name);

  public readonly id: string;
  public readonly aggregateName: string = 'user';

  dateCreated: Date;
  dateModified: Date;

  userName: Username;
  password: Password;

  fullName: FullName;

  lastLoggedIn: Date;
  numberLogins: number;
  currentlyLoggedIn: boolean;

  constructor(id: string) {
    super();
    this.id = id;
    this.numberLogins = 0;
  }

  async create(username: string, password: string, fullName: string) {
    this.userName = await Username.create(username);
    this.password = await Password.create(password);
    this.fullName = await FullName.create(fullName);
    this.dateCreated = new Date();
    this.dateModified = new Date();

    try {
      this.apply(
        new UserCreatedEvent(
          this.id,
          this.userName.value,
          this.password.value,
          this.fullName.value,
          this.dateCreated,
          this.dateModified,
        ),
      );
    } catch (err) {
      throw new Error(err);
    }
  }

  async changeFullName(newFullName: string) {
    try {
      this.logger.debug(`newFullName: ${newFullName}`);

      const fullName = await FullName.create(newFullName);
      this.apply(new FullNameChangedEvent(this.id, fullName.value));
    } catch (err) {
      throw new Error(err);
    }
  }

  async login(password: string) {
    this.logger.debug(`this.password.value: ${this.password.value}`);
    this.logger.debug(`password: ${password}`);

    const areEqual = await bcrypt.compare(password, this.password.value);

    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const numberLogins = this.numberLogins + 1;

    this.apply(
      new UserLoggedInEvent(
        this.id,
        this.userName.value,
        new Date(),
        numberLogins,
        new Date(),
      ),
    );
  }

  logout() {
    this.currentlyLoggedIn = false;

    this.apply(new UserLoggedOutEvent(this.id, new Date()));
  }

  onUserCreatedEvent(event: UserCreatedEvent) {
    this.userName = Username.createReplay(event.userName);
    this.password = Password.createReplay(event.password);
    this.fullName = FullName.createReplay(event.fullName);
    this.dateCreated = event.dateCreated;
    this.dateModified = event.dateModified;
  }

  onUserLoggedInEvent(event: UserLoggedInEvent) {
    this.lastLoggedIn = event.dateLoggedIn;
    this.numberLogins = event.numberLogins;
    this.currentlyLoggedIn = true; // for validateUser we replay all events to see if the user is currently logged in
    this.dateModified = event.dateModified;
  }

  onUserLoggedOutEvent(event: UserLoggedOutEvent) {
    this.currentlyLoggedIn = false;
  }

  onFullNameChangedEvent(event: FullNameChangedEvent) {
    this.fullName = FullName.createReplay(event.newFullName);
  }
}
