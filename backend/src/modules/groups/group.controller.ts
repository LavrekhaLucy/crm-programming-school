import { Body, Controller, Get, Post } from '@nestjs/common';
import { GroupService } from './services/group.service';
import { CreateGroupDto } from './models/create-group.dto';
import { ResponseGroupDto } from './models/response-group.dto';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  create(@Body() dto: CreateGroupDto): Promise<ResponseGroupDto> {
    return this.groupService.create(dto);
  }

  @Get()
  findAll(): Promise<ResponseGroupDto[]> {
    return this.groupService.findAll();
  }
}
