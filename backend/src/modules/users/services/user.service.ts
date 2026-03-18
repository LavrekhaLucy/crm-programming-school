import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../../../database/entities/user.entity';
import { UpdateUserReqDto } from '../models/dto/req/update-user.req.dto';
import { UserBaseResDto } from '../models/dto/res/user-base.res.dto';
import { UserResDto } from '../models/dto/res/user.res.dto';
import { BaseUserReqDto } from '../models/dto/req/user-base.req.dto';
import { UserRepository } from '../../repository/services/user.repository';
import { UserMapper } from '../user.mapper';
import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';

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

  async findAll(
    page: number = 1,
    limit: number = 5,
  ): Promise<{ items: UserBaseResDto[]; total: number }> {
    const skip = (page - 1) * limit;

    const [items, total] = await this.userRepository.findAndCount({
      select: ['id', 'name', 'surname', 'email', 'isActive', 'lastLogin'],
      order: { id: 'DESC' },
      take: limit,
      skip: skip,
    });

    return {
      items,
      total,
    };
  }

  async update(id: number, dto: UpdateUserReqDto): Promise<UserEntity> {
    await this.userRepository.update({ id }, dto);
    return this.userRepository.findOneBy({ id });
  }

  async disable(idToBan: number, currentUser: UserResDto): Promise<UserResDto> {
    const userToBan = await this.userRepository.findOneBy({ id: idToBan });
    if (!userToBan) {
      throw new NotFoundException(`User #${idToBan} not found`);
    }
    if (currentUser.role !== UserRoleEnum.ADMIN) {
      throw new ForbiddenException('Only the administrator can ban users');
    }
    if (idToBan === currentUser.id) {
      throw new BadRequestException('You cannot ban yourself');
    }
    userToBan.isActive = false;
    const updatedUser = await this.userRepository.save(userToBan);

    return UserMapper.toResDto(updatedUser);
  }

  async enable(id: number, currentUser: UserResDto): Promise<UserResDto> {
    if (currentUser.role !== UserRoleEnum.ADMIN) {
      throw new ForbiddenException('Only the administrator can unban users');
    }

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
