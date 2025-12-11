import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../database/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from '../../database/entities/token.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private accessTokenExpiresIn: number;
  private refreshTokenExpiresIn: number;
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(TokenEntity)
    private tokenRepository: Repository<TokenEntity>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenExpiresIn =
      this.configService.get<number>('ACCESS_TOKEN_EXPIRATION') || 0;
    this.refreshTokenExpiresIn =
      this.configService.get<number>('REFRESH_TOKEN_EXPIRATION') || 0;
  }

  async register(registerDto: RegisterDto): Promise<UserEntity> {
    const user = this.userRepository.create(registerDto);
    return this.userRepository.save(user);
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    const jti = Math.random().toString(36).substring(2);
    const payload = { userId: user.id, username: user.username, jti };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(
    username: string,
    password: string,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
  //   private async saveTokens(
  //       const tokenEntity = this.tokenRepository.create(
  //           user: UserEntity,
  //   accessToken:string,
  //   refreshToken:string,
  //   accessTokenExpiresIn:number,
  //   refreshTokenExpiresIn:number,
  //   jti:string,
  // )Promise<void >{
  //         this.tokenRepository.create({
  //           accessToken,
  //           refreshToken,
  //           accessTokenExpiresAt:new Date(Date.now()+this.accessTokenExpiresIn*1000),
  //         })
  //   }
}
