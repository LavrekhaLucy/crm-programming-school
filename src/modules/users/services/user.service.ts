import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../../database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserReqDto } from '../models/dto/req/update-user.req.dto';
import { UserBaseResDto } from '../models/dto/res/user-base.res.dto';
import { UserResDto } from '../models/dto/res/user.res.dto';
import { BaseUserReqDto } from '../models/dto/req/user-base.req.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async create(baseUserReqDto: BaseUserReqDto): Promise<UserEntity> {
    const newUser = this.userRepository.create(baseUserReqDto);
    return await this.userRepository.save(newUser);
  }

  async findById(managerId: number): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { id: managerId },
      relations: ['orders'],
    });
  }

  async findAll(): Promise<UserBaseResDto[]> {
    return await this.userRepository.find({
      select: ['id', 'name', 'surname', 'email'],
      order: { surname: 'ASC' },
    });
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
