import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from '../../shared/shared.module';
import { EnvService } from '../../shared/env.service';
import { JwtStrategy } from './jwt.strategy';
import { TokenRepository } from '../repository/services/token.repository';
import { UserRepository } from '../repository/services/user.repository';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [SharedModule],
      useFactory: (envService: EnvService) => ({
        secret: envService.jwtAccessSecret,
        signOptions: {
          expiresIn: envService.jwtExpirationTime,
        },
      }),
      inject: [EnvService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserRepository, TokenRepository],
})
export class AuthModule {}
