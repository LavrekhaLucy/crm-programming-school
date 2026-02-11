import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
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

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseGroupDto | null> {
    return this.groupService.findOne(id);
  }
}
