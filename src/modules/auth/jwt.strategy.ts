import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from '../users/interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from '../../database/entities/token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET') || '';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: IJwtPayload): Promise<IJwtPayload> {
    const tokenEntity = await this.tokenRepository.findOne({
      where: { jti: payload.jti, IsBlocked: false },
      relations: ['user'],
    });
    if (!tokenEntity) {
      throw new UnauthorizedException('Token is blocked or invalid');
    }
    return payload;
  }
}
