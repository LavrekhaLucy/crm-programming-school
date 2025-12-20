import { Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/services/order.service';
import { UserService } from '../users/services/user.service';
import { UserEntity } from '../../database/entities/user.entity';
import { OrdersStatsDto } from '../orders/models/dto/req/order-stats.dto';
import { OrderEntity } from '../../database/entities/order.entity';
import { UserResDto } from '../users/models/dto/res/user.res.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UserService,
    private readonly ordersService: OrdersService,
  ) {}

  // користувачі
  getAllUsers(): Promise<UserResDto[]> {
    return this.usersService.findAll();
  }

  disableUser(userId: number): Promise<UserEntity> {
    return this.usersService.disable(userId);
  }

  // заявки (orders)
  getAllOrders(): Promise<OrderEntity[]> {
    return this.ordersService.findAll();
  }

  getOrdersStats(): Promise<OrdersStatsDto[]> {
    return this.ordersService.getStatsByStatus();
  }
}
