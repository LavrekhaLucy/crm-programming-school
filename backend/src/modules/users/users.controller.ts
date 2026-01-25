import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';

import { UserRoleEnum } from '../../database/entities/enums/user-role.enum';
import { UserRequest } from '../auth/interfaces/user-request.interface';
import { BaseUserReqDto } from './models/dto/req/user-base.req.dto';
import { UserEntity } from '../../database/entities/user.entity';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRoleEnum.MANAGER, UserRoleEnum.ADMIN)
  @Get('profile')
  async getProfile(@Request() req: UserRequest): Promise<UserEntity> {
    return await this.userService.findById(req.user.userId);
  }

  @Roles(UserRoleEnum.ADMIN)
  @Post()
  create(@Body() baseUserReqDto: BaseUserReqDto): Promise<UserEntity> {
    return this.userService.create(baseUserReqDto);
  }

  @Roles(UserRoleEnum.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.userService.delete(id);
  }
}
