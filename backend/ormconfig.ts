import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { EnvService } from './src/shared/env.service';
import { DataSource } from 'typeorm';

const configService = new ConfigService();
const envService = new EnvService(configService);

export default new DataSource({
  type: envService.db_Type as 'mysql',
  host: envService.mysqlHost,
  port: envService.mysqlPort,
  username: envService.mysqlUser,
  password: envService.mysqlPassword,
  database: envService.mysqlDatabase,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/src/database/migrations/*{.ts,.js}'],
  synchronize: false,
});
