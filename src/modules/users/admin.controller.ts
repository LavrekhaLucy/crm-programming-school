import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserRoleEnum } from '../../database/entities/enums/user-role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(RolesGuard)
@Roles(UserRoleEnum.ADMIN)
export class AdminController {
  @Get('dashboard')
  getDashboard() {
    return {
      message: 'Admin dashboard доступний',
    };
  }

  // @Post('managers')
  // createManager(@Body() dto: CreateManagerDto) {
  //   return this.AdminService.createManager(dto);
  // }
}
