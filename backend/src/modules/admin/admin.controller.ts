import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
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
import { Request } from 'express';
import { UserWithStatsResDto } from '../users/models/dto/res/user-with-stats-res.dto';

export interface RequestWithUser extends Request {
  user: UserResDto;
}

@ApiTags('Admin')
@ApiBearerAuth('access-token')
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Roles(UserRoleEnum.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('managers')
  async createManager(
    @Body() createManagerReqDto: CreateManagerReqDto,
  ): Promise<UserBaseResDto> {
    return await this.adminService.createManager(createManagerReqDto);
  }

  @Get('users')
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ): Promise<{
    users: UserWithStatsResDto[];
    total: number;
    stats: OrdersStatsDto;
  }> {
    return this.adminService.getAllUsers(page, limit);
  }

  @Post(':id/re-token')
  async reToken(@Param('id') id: number) {
    return await this.adminService.createActivationToken(id);
  }

  @Patch(':id/ban')
  async ban(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ): Promise<UserResDto> {
    return await this.adminService.disableUser(id, req.user);
  }

  @Patch(':id/unban')
  async unban(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ): Promise<UserResDto> {
    return await this.adminService.enableUser(id, req.user);
  }

  @Get('orders/stats')
  getOrdersStats(): Promise<OrdersStatsDto> {
    return this.adminService.getOrdersStats();
  }
}
