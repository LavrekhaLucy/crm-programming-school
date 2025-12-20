import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserRoleEnum } from '../../database/entities/enums/user-role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { OrderEntity } from '../../database/entities/order.entity';
import { CreateManagerDto } from '../users/models/dto/req/create-manager.req.dto';
import { UserEntity } from '../../database/entities/user.entity';
import { OrdersStatsDto } from '../orders/models/dto/req/order-stats.dto';
import { UserService } from '../users/services/user.service';
import { UserResDto } from '../users/models/dto/res/user.res.dto';

@Controller('admin')
@UseGuards(RolesGuard)
@Roles(UserRoleEnum.ADMIN)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return {
      message: 'Admin dashboard доступний',
    };
  }

  @Post('managers')
  createManager(
    @Body() createManagerDto: CreateManagerDto,
  ): Promise<UserEntity> {
    return this.userService.create(createManagerDto);
  }

  @Get('users')
  getAllUsers(): Promise<UserResDto[]> {
    return this.adminService.getAllUsers();
  }

  @Patch('users/:id/disable')
  disable(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.adminService.disableUser(id);
  }

  @Get('orders')
  getAllOrders(): Promise<OrderEntity[]> {
    return this.adminService.getAllOrders();
  }
  @Get('orders/stats')
  getOrdersStats(): Promise<OrdersStatsDto[]> {
    return this.adminService.getOrdersStats();
  }
}
