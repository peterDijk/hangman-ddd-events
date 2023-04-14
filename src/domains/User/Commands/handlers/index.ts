import { ChangeFullNameHandler } from './ChangeFullName.handler';
import { CreateNewUserHandler } from './CreateNewUser.handler';
import { LoginUserHandler } from './LoginUser.handler';
import { LogoutUserHandler } from './LogoutUser.handler';

export default [
  CreateNewUserHandler,
  LoginUserHandler,
  LogoutUserHandler,
  ChangeFullNameHandler,
];
