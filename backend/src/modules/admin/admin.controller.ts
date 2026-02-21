import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserRoleEnum } from '../../database/entities/enums/user-role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

import { AdminService } from './services/admin.service';
import { OrdersStatsDto } from '../orders/models/dto/req/order-stats.dto';
import { UserResDto } from '../users/models/dto/res/user.res.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserBaseResDto } from '../users/models/dto/res/user-base.res.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateManagerReqDto } from './models/dto/req/create-manager.req.dto';

@ApiTags('Admin')
@ApiBearerAuth('access-token')
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Roles(UserRoleEnum.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('managers')
  createManager(
    @Body() createManagerReqDto: CreateManagerReqDto,
  ): Promise<UserBaseResDto> {
    return this.adminService.createManager(createManagerReqDto);
  }

  @Get('users')
  getAllUsers(): Promise<UserResDto[]> {
    return this.adminService.getAllUsers();
  }

  @Post(':id/re-token')
  async reToken(@Param('id') id: number) {
    return await this.adminService.createActivationToken(id);
  }

  @Patch(':id/ban')
  async ban(@Param('id') id: number): Promise<UserResDto> {
    return await this.adminService.disableUser(id);
  }

  @Patch(':id/unban')
  async unban(@Param('id') id: number): Promise<UserResDto> {
    return await this.adminService.enableUser(id);
  }

  @Get('orders/stats')
  getOrdersStats(): Promise<OrdersStatsDto> {
    return this.adminService.getOrdersStats();
  }
}
