// import { Test } from '@nestjs/testing';
// import { OrdersService } from '../services/order.service';
// import { MockServiceType } from '../../../../test/types/mock-service.type';
// import { OrdersRepository } from '../../repository/services/orders.repository';
// import { mockResponseOrderDto } from '../__mocks__/res-order-dto.mock';
// import { mockCreateOrderDto } from '../__mocks__/create-order-dto.mock';
// import { mockCreatedEntity } from '../__mocks__/create-entity.mock';
// import { usersModuleProviders } from '../../users/__mocks__/users-module.mock';
// import { NotFoundException } from '@nestjs/common';
// // import { EntityManager } from 'typeorm';
// import { mockOrderRepository } from '../__mocks__/order-repository.mock';
// import { mockUserRepository } from '../../users/__mocks__/user-repository.mock';
// import { mockOrderRepoFindOne } from '../__mocks__/order-repo-find-one.mock';
// import { UserEntity } from '../../../database/entities/user.entity';
// import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';
//
// describe('OrderService', () => {
//   let service: OrdersService;
//   let repository: MockServiceType<OrdersRepository>;
//   // let entityManager: EntityManager;
//
//   const mockManager: UserEntity = {
//     id: 42,
//     username: 'manager1',
//     role: UserRoleEnum.MANAGER,
//     email: 'manager@example.com',
//     password: 'pass',
//     isActive: true,
//     created_at: new Date(),
//     updated_at: new Date(),
//   };
//
//   beforeEach(async () => {
//     const module = await Test.createTestingModule({
//       providers: [...usersModuleProviders, OrdersService],
//     }).compile();
//     service = module.get(OrdersService);
//     repository = module.get(OrdersRepository);
//     // entityManager = module.get(EntityManager);
//   });
//
//   afterEach(() => {
//     jest.clearAllMocks();
//   });
//
//   describe('create', () => {
//     it('should create an order', async () => {
//       jest.spyOn(repository, 'create').mockReturnValue(mockCreatedEntity);
//       repository.save.mockResolvedValue(mockResponseOrderDto);
//
//       const result = await service.create(mockCreateOrderDto);
//
//       expect(repository.create).toHaveBeenCalledWith(mockCreateOrderDto);
//       expect(repository.save).toHaveBeenCalledWith(mockCreatedEntity);
//       expect(result).toEqual(mockResponseOrderDto);
//     });
//   });
//   describe('findAll', () => {
//     it('should return an array of orders', async () => {
//       repository.find.mockResolvedValue([mockResponseOrderDto]);
//
//       const result = await service.findAll();
//
//       expect(repository.find).toHaveBeenCalledTimes(1);
//       expect(result).toEqual([mockResponseOrderDto]);
//     });
//   });
//   describe('findOne', () => {
//     it('should return a single order by id', async () => {
//       repository.findOneBy.mockResolvedValue(mockResponseOrderDto);
//       const result = await service.findOne('order-id-123');
//
//       expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'order-id-123' });
//       expect(result).toEqual(mockResponseOrderDto);
//     });
//
//     it('should throw NotFoundException if order not found', async () => {
//       repository.findOneBy.mockResolvedValue(null);
//       await expect(service.findOne('non-existent-id')).rejects.toThrow(
//         NotFoundException,
//       );
//     });
//   });
//   describe('assignManager', () => {
//     it('should assign manager to order', async () => {
//       const result = await service.assignManager('order1', 42);
//
//       expect(mockOrderRepository.findOne).toHaveBeenCalledWith({
//         where: { id: 'order1' },
//       });
//       expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 42 });
//       expect(mockOrderRepository.save).toHaveBeenCalledWith(mockManager);
//
//       expect(result.manager.id).toBe(42);
//     });
//   });
//   it('should throw NotFoundException if order not found', async () => {
//     mockOrderRepository.findOne.mockResolvedValue(null);
//
//     await expect(service.assignManager('missingOrder', 42)).rejects.toThrow(
//       'Order not found',
//     );
//   });
//
//   it('should throw NotFoundException if manager not found', async () => {
//     mockOrderRepository.findOne.mockResolvedValue(mockOrderRepoFindOne);
//     mockUserRepository.findOneBy.mockResolvedValue({
//       id: 42,
//       username: 'manager1',
//       role: 'MANAGER',
//     } as unknown as UserEntity);
//
//     await expect(service.assignManager('order1', 999)).rejects.toThrow(
//       'Manager not found',
//     );
//   });
// });
