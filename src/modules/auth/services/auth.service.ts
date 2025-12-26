import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../../database/entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { LoginReqDto } from '../dto/req/login.req.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from '../../../database/entities/token.entity';
import { ConfigService } from '@nestjs/config';
import { ITokens } from '../interfaces/token.interface';
import { RefreshTokenDto } from '../models/refresh-token.dto';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { RegisterReqDto } from '../dto/req/register.req.dto';
import { UserResDto } from '../../users/models/dto/res/user.res.dto';

@Injectable()
export class AuthService {
  private readonly accessTokenExpiresIn: number;
  private readonly refreshTokenExpiresIn: number;

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    this.accessTokenExpiresIn =
      this.configService.get<number>('JWT_ACCESS_EXPIRES_IN') || 0;
    this.refreshTokenExpiresIn =
      this.configService.get<number>('JWT_REFRESH_EXPIRES_IN') || 0;
  }

  async register(registerReqDto: RegisterReqDto): Promise<UserResDto> {
    const user = this.userRepository.create(registerReqDto);
    const saved = await this.userRepository.save(user);

    return {
      id: saved.id,
      email: saved.email,
      role: saved.role,
      name: saved.name,
      avatarUrl: saved.avatarUrl,
      locale: saved.locale,
      isAdultAccepted: saved.isAdultAccepted,
    };
  }

  async login(loginDto: LoginReqDto): Promise<ITokens> {
    return this.entityManager.transaction(async (manager) => {
      const user = await this.validateUser(loginDto);
      const jti = Math.random().toString(36).substring(2);
      const payload = {
        userId: user.id,
        username: user.username,
        jti,
        role: user.role,
      };
      const accessToken = this.jwtService.sign(payload, {
        expiresIn: `${this.accessTokenExpiresIn}s`,
      });
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: `${this.refreshTokenExpiresIn}s`,
      });

      await this.saveTokens(
        manager,
        user,
        accessToken,
        refreshToken,
        this.accessTokenExpiresIn,
        this.refreshTokenExpiresIn,
        jti,
      );
      return {
        accessToken,
        refreshToken,
      };
    });
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<ITokens> {
    const { refreshToken } = refreshTokenDto;

    return this.entityManager.transaction(async (manager) => {
      const tokenRepository = manager.getRepository(TokenEntity);

      this.jwtService.verify<IJwtPayload>(refreshToken);

      const tokenEntity = await tokenRepository.findOne({
        where: { refreshToken, isBlocked: false },
        relations: ['user'],
      });

      if (!tokenEntity || tokenEntity.refreshTokenExpiresAt < new Date()) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      tokenEntity.isBlocked = true;
      await tokenRepository.save(tokenEntity);

      const jti = Math.random().toString(36).substring(2);

      const payload = {
        userId: tokenEntity.user.id,
        username: tokenEntity.user.username,
        role: tokenEntity.user.role,
        jti,
      };

      const newAccessToken = this.jwtService.sign(payload, {
        expiresIn: `${this.accessTokenExpiresIn}s`,
      });

      const newRefreshToken = this.jwtService.sign(payload, {
        expiresIn: `${this.refreshTokenExpiresIn}s`,
      });

      await this.saveTokens(
        manager,
        tokenEntity.user,
        newAccessToken,
        newRefreshToken,
        this.accessTokenExpiresIn,
        this.refreshTokenExpiresIn,
        jti,
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    });
  }

  async logOut(refreshTokenDto: RefreshTokenDto): Promise<void> {
    const { refreshToken } = refreshTokenDto;
    const tokenEntity = await this.tokenRepository.findOne({
      where: { refreshToken, isBlocked: false },
    });
    if (tokenEntity) {
      tokenEntity.isBlocked = true;
      await this.tokenRepository.save(tokenEntity);
    }
  }

  private async saveTokens(
    manager: EntityManager,
    user: UserEntity,
    accessToken: string,
    refreshToken: string,
    accessTokenExpiresIn: number,
    refreshTokenExpiresIn: number,
    jti: string,
  ): Promise<void> {
    const tokenRepository = manager.getRepository(TokenEntity);

    const tokenEntity = tokenRepository.create({
      accessToken,
      refreshToken,
      accessTokenExpiresAt: new Date(Date.now() + accessTokenExpiresIn * 1000),
      refreshTokenExpiresAt: new Date(
        Date.now() + refreshTokenExpiresIn * 1000,
      ),
      user,
      jti,
    });
    await tokenRepository.save(tokenEntity);
  }

  private async validateUser(loginDto: LoginReqDto): Promise<UserEntity> {
    const { login, password } = loginDto;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username = :login OR user.email = :login', { login })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
