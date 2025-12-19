import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './database/entities/user.entity';
import { UserRoleEnum } from './database/entities/enums/user-role.enum';
import { Repository } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userRepo = app.get<Repository<UserEntity>>(
    getRepositoryToken(UserEntity),
  );

  const adminEmail = 'admin@gmail.com';

  const adminExists = await userRepo.findOne({
    where: { email: adminEmail },
  });

  if (!adminExists) {
    await userRepo.save(
      userRepo.create({
        email: adminEmail,
        password: 'admin',
        role: UserRoleEnum.ADMIN,
        username: 'admin',
        name: 'Admin',
        surname: 'System',
        isActive: true,
        isAdultAccepted: true,
      }),
    );
  }

  await app.close();
}

bootstrap().catch((err) => {
  console.error('Seed failed', err);
  process.exit(1);
});
