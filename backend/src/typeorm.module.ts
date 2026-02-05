import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from './shared/shared.module';
import { EnvService } from './shared/env.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (envService: EnvService) => ({
        type: envService.db_Type as 'mysql',
        host: envService.mysqlHost,
        port: envService.mysqlPort,
        username: envService.mysqlUser,
        password: envService.mysqlPassword,
        database: envService.mysqlDatabase,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        ssl: {
          rejectUnauthorized: false,
        },
        migrations: [__dirname + '/src/database/migrations/*{.ts,.js}'],
      }),
      inject: [EnvService],
    }),
  ],
})
export class TypeormModule {}
