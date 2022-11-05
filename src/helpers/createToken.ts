import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/infrastructure/dto/Auth.dto';

export function createToken(
  username: string,
  jwtService: JwtService,
): { accessToken: string } {
  const user: JwtPayload = { username };
  const accessToken = jwtService.sign(user);
  return {
    accessToken,
  };
}
