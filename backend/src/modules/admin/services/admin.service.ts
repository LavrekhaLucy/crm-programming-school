import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersService } from '../../orders/services/order.service';
import { UserService } from '../../users/services/user.service';
import { OrdersStatsDto } from '../../orders/models/dto/req/order-stats.dto';
import { UserBaseResDto } from '../../users/models/dto/res/user-base.res.dto';
import { CreateManagerReqDto } from '../models/dto/req/create-manager.req.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UserService,
    private readonly ordersService: OrdersService,
    private readonly jwtService: JwtService,
  ) {}

  createManager(
    createManagerReqDto: CreateManagerReqDto,
  ): Promise<UserBaseResDto> {
    return this.usersService.create(createManagerReqDto);
  }

  async createActivationToken(managerId: number): Promise<{ link: string }> {
    const user = await this.usersService.findById(managerId);

    if (!user) {
      throw new NotFoundException(`Manager with ID ${managerId} not found`);
    }
    const payload = {
      sub: user.id,
      email: user.email,
      action: 'activate',
    };

    const token = this.jwtService.sign(payload, { expiresIn: '30m' });
    const link = `http://localhost:3000/activate/${token}`;

    return { link };
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

  getOrdersStats(): Promise<OrdersStatsDto> {
    return this.ordersService.getStatsByStatus();
  }
}
