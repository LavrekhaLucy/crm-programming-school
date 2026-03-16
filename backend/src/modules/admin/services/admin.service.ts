import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersService } from '../../orders/services/order.service';
import { UserService } from '../../users/services/user.service';
import { OrdersStatsDto } from '../../orders/models/dto/req/order-stats.dto';
import { UserBaseResDto } from '../../users/models/dto/res/user-base.res.dto';
import { CreateManagerReqDto } from '../models/dto/req/create-manager.req.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailTypeEnum } from '../../../database/entities/enums/email-type.enum';
import { EmailService } from '../../auth/services/email.service';
import { UserRepository } from '../../repository/services/user.repository';
import { UserWithStatsResDto } from '../../users/models/dto/res/user-with-stats-res.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly usersService: UserService,
    private readonly ordersService: OrdersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
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

    const link = `${process.env.APP_FRONT_URL}/auth/activate/${token}`;

    await this.userRepository.update(managerId, { actionToken: token });

    await this.emailService
      .sendMail(EmailTypeEnum.ACTIVATE_ACCOUNT, user.email, {
        name: user.name,
        link: link,
      })
      .catch((err) => {
        console.error('Activation email failed to send:', err);
      });

    return { link };
  }

  async getAllUsers(): Promise<{
    users: UserWithStatsResDto[];
    stats: OrdersStatsDto;
  }> {
    const users = await this.usersService.findAll();

    const stats = await this.ordersService.getStatsByStatus();

    const performanceArray = await this.ordersService.getManagersPerformance();

    const usersWithStats = users.map((user) => {
      const userStats = performanceArray.find((p) => p.managerId === user.id);

      return {
        ...user,
        stats: userStats || {
          total: 0,
          new: 0,
          agree: 0,
          in_work: 0,
          disagree: 0,
          dubbing: 0,
        },
      };
    });

    return {
      users: usersWithStats,
      stats,
    };
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
