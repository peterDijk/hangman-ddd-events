import { ChangeUserNameHandler } from './ChangeUserName.handler';
import { CreateNewUserHandler } from './CreateNewUser.handler';
import { LoginUserHandler } from './LoginUser.handler';
import { LogoutUserHandler } from './LogoutUser.handler';

export default [
  CreateNewUserHandler,
  LoginUserHandler,
  LogoutUserHandler,
  ChangeUserNameHandler,
];
