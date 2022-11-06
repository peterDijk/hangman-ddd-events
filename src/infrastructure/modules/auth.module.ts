import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user.module';
import { AuthService } from '../services/auth.service';
// import { AuthController } from './auth.controller';
// import { AuthResolver } from '../resolvers/auth.resolver';
import { JwtStrategy } from './jwt.strategy';
import { AuthResolver } from '../resolvers/auth.resolver';

@Module({
  imports: [
    UserModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      secret: 'process.env.JWT_SECRET',
      signOptions: {
        expiresIn: '7d', //process.env.EXPIRES_IN,
      },
    }),
  ],
  // controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AuthResolver, JwtService],
  exports: [PassportModule, JwtModule, JwtService],
})
export class AuthModule {}
