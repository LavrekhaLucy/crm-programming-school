import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../../database/entities/enums/user-role.enum';
import { UserRequest } from '../auth/interfaces/user-request.interface';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Roles(UserRoleEnum.MANAGER)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Request() req: UserRequest) {
    return await this.userService.getManagerOrders(req.user.userId);
  }
}
