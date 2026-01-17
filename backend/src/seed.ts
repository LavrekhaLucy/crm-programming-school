import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './database/entities/user.entity';
import { UserRoleEnum } from './database/entities/enums/user-role.enum';
import { Repository } from 'typeorm';
import { EnvService } from './shared/env.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userRepo = app.get<Repository<UserEntity>>(
    getRepositoryToken(UserEntity),
  );
  const envService = app.get(EnvService);

  const adminEmail = envService.adminEmail;
  const adminPassword = envService.adminPassword;

  const adminExists = await userRepo.findOne({
    where: { email: adminEmail },
    select: ['id'],
  });

  if (!adminExists) {
    const admin = userRepo.create({
      email: adminEmail,
      password: adminPassword,
      role: UserRoleEnum.ADMIN,
      username: 'admin',
      name: 'Admin',
      surname: 'System',
      isActive: true,
      isAdultAccepted: true,
    });

    await userRepo.save(admin);
  } else {
    console.log('Admin already exists, skipping seed');
  }

  await app.close();
}

bootstrap().catch((err) => {
  console.error('Seed failed', err);
  process.exit(1);
});
