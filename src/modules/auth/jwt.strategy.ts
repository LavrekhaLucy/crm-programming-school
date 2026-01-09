import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { TokenRepository } from '../repository/services/token.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly tokenRepository: TokenRepository,
  ) {
    const jwtAccessSecret =
      configService.get<string>('JWT_ACCESS_SECRET') || '';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtAccessSecret,
    });
  }

  async validate(payload: IJwtPayload) {
    const tokenEntity = await this.tokenRepository.findOne({
      where: { jti: payload.jti, isBlocked: false },
      relations: ['user'],
    });

    if (!tokenEntity) {
      throw new UnauthorizedException('Token is blocked or invalid');
    }

    return tokenEntity.user;
  }
}
