import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../../database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async findByOne(username: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ username });
  }
}
