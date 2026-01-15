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
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './services/order.service';
import { CreateOrderDto } from './models/dto/req/create-order.dto';
import { UpdateOrderDto } from './models/dto/req/update-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { ResponseOrderDto } from './models/dto/res/response-order.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../../database/entities/enums/user-role.enum';
import { UserRequest } from '../auth/interfaces/user-request.interface';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles(UserRoleEnum.MANAGER, UserRoleEnum.ADMIN)
  @Post()
  create(@Body() dto: CreateOrderDto): Promise<ResponseOrderDto> {
    return this.ordersService.create(dto);
  }

  @Roles(UserRoleEnum.MANAGER, UserRoleEnum.ADMIN)
  @Get()
  findAll(): Promise<ResponseOrderDto[]> {
    return this.ordersService.findAll();
  }

  @Roles(UserRoleEnum.MANAGER, UserRoleEnum.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<ResponseOrderDto> {
    return this.ordersService.findOne(id);
  }

  @Roles(UserRoleEnum.MANAGER, UserRoleEnum.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
  ): Promise<ResponseOrderDto> {
    return this.ordersService.update(id, dto);
  }
  @Roles(UserRoleEnum.ADMIN)
  @Patch(':id/assign/:managerId')
  async assignManager(
    @Param('id') orderId: string,
    @Param('managerId', ParseIntPipe) managerId: number,
  ) {
    return await this.ordersService.assignManager(orderId, managerId);
  }

  @Roles(UserRoleEnum.MANAGER, UserRoleEnum.ADMIN)
  @Patch(':id/take')
  async takeOrder(@Param('id') id: string, @Req() req: UserRequest) {
    return await this.ordersService.takeOrder(id, req.user.userId);
  }

  @Roles(UserRoleEnum.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.ordersService.delete(id);
  }
}
