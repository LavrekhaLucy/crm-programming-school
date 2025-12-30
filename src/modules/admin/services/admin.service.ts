import { Injectable } from '@nestjs/common';
import { OrdersService } from '../../orders/services/order.service';
import { UserService } from '../../users/services/user.service';
import { UserEntity } from '../../../database/entities/user.entity';
import { OrdersStatsDto } from '../../orders/models/dto/req/order-stats.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseOrderDto } from '../../orders/models/dto/res/response-order.dto';
import { CreateManagerResDto } from '../models/dto/res/create-manager.res.dto';
import { UserBaseResDto } from '../../users/models/dto/res/user-base.res.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UserService,
    private readonly ordersService: OrdersService,
    @InjectRepository(UserEntity)
    private readonly adminRepository: Repository<UserEntity>,
  ) {}

  // користувачі
  createManager(
    createManagerResDto: CreateManagerResDto,
  ): Promise<UserBaseResDto> {
    const manager = this.adminRepository.create(createManagerResDto);
    return this.adminRepository.save(manager);
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

  // заявки (orders)
  getAllOrders(): Promise<ResponseOrderDto[]> {
    return this.ordersService.findAll();
  }

  getOrdersStats(): Promise<OrdersStatsDto[]> {
    return this.ordersService.getStatsByStatus();
  }
}
