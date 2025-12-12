import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  public readonly dbType: string;
  public readonly mysqlHost: string;
  public readonly mysqlPort: number;
  public readonly mysqlDatabase: string;
  public readonly mysqlUser: string;
  public readonly mysqlPassword: string;
  public readonly mysqlRootPassword: string;
  public readonly jwtSecret: string;
  public readonly jwtExpirationTime: number;
  public readonly accessTokenExpirationTime: number;
  public readonly refreshTokenExpirationTime: number;

  constructor(private configService: ConfigService) {
    this.dbType = configService.get<string>('TYPE') || 'mysql';
    this.mysqlHost = configService.get<string>('MYSQL_HOST') || '';
    this.mysqlPort = configService.get<number>('MYSQL_PORT', 3306);
    this.mysqlDatabase = configService.get<string>('MYSQL_DATABASE') || '';
    this.mysqlUser = configService.get<string>('MYSQL_USER') || '';
    this.mysqlPassword = configService.get<string>('MYSQL_PASSWORD') || '';
    this.mysqlRootPassword =
      configService.get<string>('MYSQL_ROOT_PASSWORD') || '';
    this.jwtSecret = configService.get<string>('JWT_SECRET') || '';
    this.jwtExpirationTime =
      configService.get<number>('JWT_EXPIRATION_TIME') || 3600;
    this.accessTokenExpirationTime =
      configService.get<number>('ACCESS_TOKEN_EXPIRATION_TIME') || 600;
    this.refreshTokenExpirationTime =
      configService.get<number>('REFRESH_TOKEN_EXPIRATION_TIME') || 1200;
  }
}
