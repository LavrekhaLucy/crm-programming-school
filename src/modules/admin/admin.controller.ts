// import { Controller, Get, UseGuards } from '@nestjs/common';
// import { UserRoleEnum } from '../../database/entities/enums/user-role.enum';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
//
// @Controller('admin')
// @UseGuards(RolesGuard)
// @Roles(UserRoleEnum.ADMIN)
// export class AdminController {
//   @Get('dashboard')
//   getDashboard() {
//     return {
//       message: 'Admin dashboard доступний',
//     };
//   }
//   //
//   //   @Get('dashboard')
//   //   getDashboard() {
//   //     return this.adminService.getDashboard();
//   //   }
//   //
//   //   @Get('users')
//   //   getUsers() {
//   //     return this.adminService.getAllUsers();
//   //   }
//   //
//   //   @Patch('users/:id/disable')
//   //   disableUser(@Param('id') id: number) {
//   //     return this.adminService.disableUser(id);
//   //   }
//   //
//   //   @Patch('users/:id/enable')
//   //   enableUser(@Param('id') id: number) {
//   //     return this.adminService.enableUser(id);
//   //   }
//   //
//   //   @Get('orders')
//   //   getOrders() {
//   //     return this.adminService.getAllOrders();
//   //   }
//   //
//   //   @Get('orders/stats')
//   //   getOrdersStats() {
//   //     return this.adminService.getOrdersStats();
//   //   }
//   // }
//
//   // @Post('managers')
//   // createManager(@Body() dto: CreateManagerDto) {
//   //   return this.AdminService.createManager(dto);
//   // }
// }
