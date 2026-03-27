import { ConflictException, Injectable } from '@nestjs/common';
import { CreateGroupDto } from '../models/create-group.dto';
import { GroupRepository } from '../../repository/services/group.repository';
import { ResponseGroupDto } from '../models/response-group.dto';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async create(dto: CreateGroupDto): Promise<ResponseGroupDto> {
    const existingGroup = await this.groupRepository.findOneBy({
      name: dto.name,
    });
    if (existingGroup) {
      throw new ConflictException('Group already exists');
    }
    const group = this.groupRepository.create(dto);
    return await this.groupRepository.save(group);
  }

  async findAll(): Promise<ResponseGroupDto[]> {
    return this.groupRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<ResponseGroupDto | null> {
    return this.groupRepository.findOne({
      where: { id },
    });
  }
}
