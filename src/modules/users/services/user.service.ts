import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../../database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserReqDto } from '../models/dto/req/update-user.req.dto';
import { UserBaseResDto } from '../models/dto/res/user-base.res.dto';
import { UserResDto } from '../models/dto/res/user.res.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async create(userBaseResDto: UserBaseResDto): Promise<UserEntity> {
    const newUser = this.userRepository.create(userBaseResDto);
    return await this.userRepository.save(newUser);
  }

  async findOne(username: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ username });
  }

  async findAll(): Promise<UserBaseResDto[]> {
    return await this.userRepository.find({});
  }

  async update(id: number, dto: UpdateUserReqDto): Promise<UserEntity> {
    await this.userRepository.update({ id }, dto);
    return this.userRepository.findOneBy({ id });
  }

  async disable(id: number): Promise<UserResDto> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    user.isActive = false;
    return this.userRepository.save(user);
  }

  async enable(id: number): Promise<UserResDto> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    user.isActive = true;
    return this.userRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (!result) {
      throw new NotFoundException(`User #${id} not found`);
    }
  }
}
