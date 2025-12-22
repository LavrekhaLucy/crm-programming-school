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
import { UserEntity } from '../../database/entities/user.entity';
import { OrdersStatsDto } from '../orders/models/dto/req/order-stats.dto';
import { UserResDto } from '../users/models/dto/res/user.res.dto';
import { AuthGuard } from '@nestjs/passport';
import { ResponseOrderDto } from '../orders/models/dto/res/response-order.dto';
import { CreateManagerResDto } from '../users/models/dto/res/create-manager.res.dto';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
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
  ): Promise<UserEntity> {
    return this.adminService.createManager(createManagerResDto);
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
  getAllOrders(): Promise<ResponseOrderDto[]> {
    return this.adminService.getAllOrders();
  }
  @Get('orders/stats')
  getOrdersStats(): Promise<OrdersStatsDto[]> {
    return this.adminService.getOrdersStats();
  }
}
