import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { OrdersService } from './services/order.service';
import { CreateOrderDto } from './models/dto/req/create-order.dto';
import { OrderEntity } from '../../database/entities/order.entity';
import { UpdateOrderDto } from './models/dto/req/update-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { ResponseOrderDto } from './models/dto/res/response-order.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../../database/entities/enums/user-role.enum';
import { UserRequest } from '../auth/interfaces/user-request.interface';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto): Promise<OrderEntity> {
    return this.ordersService.create(dto);
  }

  @Get()
  findAll(): Promise<ResponseOrderDto[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<OrderEntity> {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
  ): Promise<OrderEntity> {
    return this.ordersService.update(id, dto);
  }

  @Patch(':id/assign/:managerId')
  async assign(
    @Param('id') orderId: string, // пам'ятаємо, що тут bigint -> string
    @Param('managerId', ParseIntPipe) managerId: number,
  ) {
    return await this.ordersService.assignManager(orderId, managerId);
  }

  @Patch(':id/take')
  @Roles(UserRoleEnum.MANAGER, UserRoleEnum.ADMIN)
  async takeOrder(@Param('id') id: string, @Req() req: UserRequest) {
    return await this.ordersService.assignManager(id, req.user.userId);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.ordersService.delete(id);
  }
}
