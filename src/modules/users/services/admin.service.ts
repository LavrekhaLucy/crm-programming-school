import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../database/entities/user.entity';
import { Repository } from 'typeorm';
import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async onModuleInit() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.warn('Admin credentials are not set');
      return;
    }

    const exists = await this.userRepo.findOne({
      where: { email: adminEmail },
    });

    if (exists) {
      return;
    }

    const admin = this.userRepo.create({
      email: adminEmail,
      password: adminPassword,
      role: UserRoleEnum.ADMIN,
      username: 'admin',
      surname: 'admin',
      isActive: true,
      locale: 'en',
      isAdultAccepted: true,
    });

    await this.userRepo.save(admin);

    console.log('Default admin user created');
  }
}
