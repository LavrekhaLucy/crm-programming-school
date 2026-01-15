import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  public readonly db_Type: string;
  public readonly mysqlHost: string;
  public readonly mysqlPort: number;
  public readonly mysqlDatabase: string;
  public readonly mysqlUser: string;
  public readonly mysqlPassword: string;
  public readonly mysqlRootPassword: string;

  public readonly jwtAccessSecret: string;
  public readonly jwtExpirationTime: number;
  public readonly accessTokenExpirationTime: number;
  public readonly refreshTokenExpirationTime: number;

  public readonly adminEmail: string;
  public readonly adminPassword: string;

  constructor(private configService: ConfigService) {
    this.db_Type = this.configService.get<string>('TYPE') || 'mysql';
    this.mysqlHost = this.configService.get<string>('MYSQL_HOST') || '';
    this.mysqlPort = this.configService.get<number>('MYSQL_PORT', 3306);
    this.mysqlDatabase = this.configService.get<string>(
      'MYSQL_DATABASE',
      'crm-programming-school',
    );
    this.mysqlUser = this.configService.get<string>('MYSQL_USER') || '';
    this.mysqlPassword = this.configService.get<string>('MYSQL_PASSWORD') || '';
    this.mysqlRootPassword =
      this.configService.get<string>('MYSQL_ROOT_PASSWORD') || '';
    this.jwtAccessSecret =
      this.configService.get<string>('JWT_ACCESS_SECRET') || '';
    this.jwtExpirationTime =
      this.configService.get<number>('JWT_EXPIRATION_TIME') || 3600;
    this.accessTokenExpirationTime =
      this.configService.get<number>('ACCESS_TOKEN_EXPIRATION_TIME') || 600;
    this.refreshTokenExpirationTime =
      this.configService.get<number>('REFRESH_TOKEN_EXPIRATION_TIME') || 1200;
    this.adminEmail = this.configService.get<string>('ADMIN_EMAIL') || '';
    this.adminPassword = this.configService.get<string>('ADMIN_PASSWORD') || '';
  }
}
