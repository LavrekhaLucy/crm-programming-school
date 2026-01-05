import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../../database/entities/user.entity';
import { UpdateUserReqDto } from '../models/dto/req/update-user.req.dto';
import { UserBaseResDto } from '../models/dto/res/user-base.res.dto';
import { UserResDto } from '../models/dto/res/user.res.dto';
import { BaseUserReqDto } from '../models/dto/req/user-base.req.dto';
import { UserRepository } from '../../repository/services/user.repository';
import { UserMapper } from '../user.mapper';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
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
    const updatedUser = await this.userRepository.save(user);

    return UserMapper.toResDto(updatedUser);
  }

  async enable(id: number): Promise<UserResDto> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    user.isActive = true;
    const updatedUser = await this.userRepository.save(user);

    return UserMapper.toResDto(updatedUser);
  }

  async delete(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`User #${id} not found`);
    }
  }
}
