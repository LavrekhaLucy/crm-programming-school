import { Injectable } from '@nestjs/common';
import { OrdersService } from '../../orders/services/order.service';
import { UserService } from '../../users/services/user.service';
import { OrdersStatsDto } from '../../orders/models/dto/req/order-stats.dto';
import { UserBaseResDto } from '../../users/models/dto/res/user-base.res.dto';
import { CreateManagerReqDto } from '../models/dto/req/create-manager.req.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UserService,
    private readonly ordersService: OrdersService,
  ) {}

  createManager(
    createManagerReqDto: CreateManagerReqDto,
  ): Promise<UserBaseResDto> {
    return this.usersService.create(createManagerReqDto);
  }
  getAllUsers(): Promise<UserBaseResDto[]> {
    return this.usersService.findAll();
  }

  disableUser(userId: number): Promise<UserBaseResDto> {
    return this.usersService.disable(userId);
  }
  enableUser(userId: number): Promise<UserBaseResDto> {
    return this.usersService.enable(userId);
  }

  getOrdersStats(): Promise<OrdersStatsDto[]> {
    return this.ordersService.getStatsByStatus();
  }
}
