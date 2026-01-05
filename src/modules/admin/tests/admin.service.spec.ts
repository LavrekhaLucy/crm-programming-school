// import { Test } from '@nestjs/testing';
// import { AdminService } from '../services/admin.service';
// import { UserRepository } from '../../repository/services/user.repository';
// import { AdminRepository } from '../../repository/services/admin.repository';
// import { UserService } from '../../users/services/user.service';
// import { mockUserRepository } from '../../users/__mocks__/user-repository.mock';
// import { OrdersService } from '../../orders/services/order.service';
// import { OrdersRepository } from '../../repository/services/orders.repository';
//
// describe('AdminService', () => {
//   // let service: AdminService;
//   // let repository: MockServiceType<AdminRepository>;
//
//   beforeEach(async () => {
//     const module = await Test.createTestingModule({
//       providers: [
//         AdminService,
//         {
//           provide: AdminRepository,
//           useValue: {},
//         },
//         UserService,
//         {
//           provide: UserRepository,
//           useValue: mockUserRepository,
//         },
//         OrdersService,
//         {
//           provide: OrdersRepository,
//           useValue: {},
//         },
//       ],
//     }).compile();
//
//     // service = module.get(AdminService);
//     // service = module.get(UserService);
//     // service = module.get(OrdersService);
//
//     // repository = module.get(AdminRepository);
//     // repository = module.get(UserRepository);
//     // repository = module.get(OrdersRepository);
//   });
//
//   afterEach(() => {
//     jest.clearAllMocks();
//   });
// });
