import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from '../models/create-group.dto';
import { GroupRepository } from '../../repository/services/group.repository';
import { ResponseGroupDto } from '../models/response-group.dto';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async create(dto: CreateGroupDto): Promise<ResponseGroupDto> {
    const group = this.groupRepository.create(dto);
    return this.groupRepository.save(group);
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
