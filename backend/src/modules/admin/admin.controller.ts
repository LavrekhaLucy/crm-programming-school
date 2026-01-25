import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
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
import { CreateManagerResDto } from './models/dto/res/create-manager.res.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserBaseResDto } from '../users/models/dto/res/user-base.res.dto';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Roles(UserRoleEnum.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboard() {
    return {
      message: 'Admin dashboard доступний',
    };
  }

  @Post('managers')
  createManager(
    @Body() createManagerResDto: CreateManagerResDto,
  ): Promise<UserBaseResDto> {
    return this.adminService.createManager(createManagerResDto);
  }

  @Get('users')
  getAllUsers(): Promise<UserResDto[]> {
    return this.adminService.getAllUsers();
  }

  @Patch('users/:id/disable')
  disable(@Param('id', ParseIntPipe) id: number): Promise<UserResDto> {
    return this.adminService.disableUser(id);
  }

  @Patch('users/:id/enable')
  enable(@Param('id', ParseIntPipe) id: number): Promise<UserResDto> {
    return this.adminService.enableUser(id);
  }

  @Get('orders/stats')
  getOrdersStats(): Promise<OrdersStatsDto[]> {
    return this.adminService.getOrdersStats();
  }
}
