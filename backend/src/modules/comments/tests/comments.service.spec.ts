import { CommentsService } from '../services/comments.service';
import { Test } from '@nestjs/testing';
import { usersModuleProviders } from '../../users/__mocks__/users-module.mock';
import { mockUserEntity } from '../../users/__mocks__/user-entity.mock';
import { mockComment } from '../__mocks__/comment.mock';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { OrderEntity } from '../../../database/entities/order.entity';
import { StatusesEnum } from '../../../database/entities/enums/statuses.enum';
import { mockOrderEntity } from '../../orders/__mocks__/mockOrderEntity';
import { mockOrderRepository } from '../../orders/__mocks__/order-repository.mock';
import { mockCommentsRepository } from '../__mocks__/comments-repository.mock';
import { UserEntity } from '../../../database/entities/user.entity';

describe('CommentsService', () => {
  let service: CommentsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [...usersModuleProviders, CommentsService],
    }).compile();

    service = module.get(CommentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addCommentToOrder', () => {
    describe('success', () => {
      it('should assign manager, status and create comment', async () => {
        const order = {
          ...mockOrderEntity,
          manager: null,
          status: StatusesEnum.NEW,
        } as OrderEntity;

        mockOrderRepository.findOne.mockResolvedValue(order);
        mockCommentsRepository.create.mockReturnValue(mockComment);
        mockCommentsRepository.save.mockResolvedValue(mockComment);

        mockOrderRepository.save.mockResolvedValue(order);

        const result = await service.addCommentToOrder(
          '1',
          mockUserEntity,
          mockComment,
        );

        expect(order.manager).toBe(mockUserEntity);
        expect(order.status).toBe(StatusesEnum.INWORK);

        expect(mockOrderRepository.save).toHaveBeenCalledWith(order);
        expect(mockCommentsRepository.save).toHaveBeenCalledWith(mockComment);
        expect(result).toEqual(mockComment);
      });
      it('should cover branch where manager and status already exist', async () => {
        const order = {
          ...mockOrderEntity,
          manager: mockUserEntity,
          status: StatusesEnum.INWORK,
        } as OrderEntity;

        mockOrderRepository.findOne.mockResolvedValue(order);
        mockOrderRepository.save.mockResolvedValue(order);
        mockCommentsRepository.create.mockReturnValue(mockComment);
        mockCommentsRepository.save.mockResolvedValue(mockComment);

        await service.addCommentToOrder('1', mockUserEntity, mockComment);

        expect(order.manager.id).toBe(mockUserEntity.id);
        expect(order.status).toBe(StatusesEnum.INWORK);
      });

      it('should cover branch where status is null', async () => {
        const order = {
          ...mockOrderEntity,
          manager: mockUserEntity,
          status: null,
        } as OrderEntity;

        mockOrderRepository.findOne.mockResolvedValue(order);
        mockOrderRepository.save.mockResolvedValue(order);
        mockCommentsRepository.create.mockReturnValue(mockComment);
        mockCommentsRepository.save.mockResolvedValue(mockComment);

        await service.addCommentToOrder('1', mockUserEntity, mockComment);

        expect(order.status).toBe(StatusesEnum.INWORK);
      });
    });

    describe('errors', () => {
      it('throws NotFoundException when order not found', async () => {
        mockOrderRepository.findOne.mockResolvedValue(null);

        await expect(
          service.addCommentToOrder('1', mockUserEntity, mockComment),
        ).rejects.toThrow(NotFoundException);
      });

      it('throws ForbiddenException when user is not order manager', async () => {
        const order: Partial<OrderEntity> = {
          id: '1',
          manager: { id: 999 } as UserEntity,
          status: StatusesEnum.INWORK,
        };

        mockOrderRepository.findOne.mockResolvedValue(order as OrderEntity);

        await expect(
          service.addCommentToOrder('1', mockUserEntity, mockComment),
        ).rejects.toThrow(ForbiddenException);
      });
    });
  });

  describe('getCommentsByOrder', () => {
    describe('success', () => {
      it('returns comments ordered by createdAt ASC', async () => {
        mockCommentsRepository.find.mockResolvedValue([mockComment]);

        const result = await service.getCommentsByOrder('order-1');

        expect(mockCommentsRepository.find).toHaveBeenCalledWith({
          where: { order: { id: 'order-1' } },
          relations: ['user'],
          order: { created_at: 'ASC' },
        });

        expect(result).toEqual([mockComment]);
      });
    });
  });
});
