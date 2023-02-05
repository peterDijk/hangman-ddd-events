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
import { UserNameChangedEvent } from './Events/UserNameChanged.event';
import { UserRepository } from './User.repository';

export class User extends AggregateRoot {
  private readonly logger = new Logger(User.name);
  private userRepository: UserRepository;

  public readonly id: string;
  public readonly aggregateName: string = 'user';

  dateCreated: Date;
  dateModified: Date;

  userName: Username;
  password: Password;

  lastLoggedIn: Date;
  numberLogins: number;
  currentlyLoggedIn: boolean;

  constructor(id: string, userRepository: UserRepository) {
    super();
    this.id = id;
    this.numberLogins = 0;

    this.userRepository = userRepository;
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

  async changeUsername(newUsername: string) {
    try {
      this.logger.debug(`newUsername: ${newUsername}`);
      const alreadyExists = await this.userRepository.findOneByUsername(
        newUsername,
      );

      if (alreadyExists) {
        throw new BadRequestException('username already exists');
      }

      this.userName = await Username.create(newUsername);
      this.apply(new UserNameChangedEvent(this.id, this.userName.value));
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

    this.lastLoggedIn = new Date();
    this.numberLogins = this.numberLogins + 1;
    this.currentlyLoggedIn = true;

    this.apply(
      new UserLoggedInEvent(
        this.id,
        this.userName.value,
        new Date(),
        this.numberLogins,
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
}
