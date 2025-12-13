import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { TokenEntity } from '../../database/entities/token.entity';
import { SharedModule } from '../../shared/shared.module';
import { EnvService } from '../../shared/env.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [SharedModule],
      useFactory: (envService: EnvService) => ({
        secret: envService.jwtSecret,
        signOptions: {
          expiresIn: envService.jwtExpirationTime,
        },
      }),
      inject: [EnvService],
    }),
    TypeOrmModule.forFeature([UserEntity, TokenEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
