import { Test } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { UserRepository } from '../../repository/services/user.repository';
import { mockUserEntity } from '../__mocks__/user-entity.mock';
import { mockBaseUserReqDto } from '../__mocks__/user-base-dto.mock';
import { UserEntity } from '../../../database/entities/user.entity';
import { DeleteResult } from 'typeorm';
import { usersModuleProviders } from '../__mocks__/users-module.mock';
import { MockServiceType } from '../../../types/mock-service.type';
import { NotFoundException } from '@nestjs/common';
import { mockAdminUser } from '../__mocks__/admin-user.mock';
import { mockManagerUser } from '../__mocks__/manager-user.mock';

describe('UsersService', () => {
  let service: UserService;
  let repository: MockServiceType<UserRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [...usersModuleProviders, UserService],
    }).compile();

    service = module.get(UserService);
    repository = module.get(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('create', () => {
    it('should create a new user', async () => {
      jest.spyOn(repository, 'create').mockReturnValue(mockUserEntity);
      repository.save.mockResolvedValue(mockUserEntity);

      const result = await service.create(mockBaseUserReqDto);

      expect(repository.create).toHaveBeenCalledWith(mockBaseUserReqDto);
      expect(repository.save).toHaveBeenCalledWith(mockUserEntity);
      expect(result).toHaveProperty('id', 1);
      expect(result).toEqual(mockUserEntity);
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      repository.findOne.mockResolvedValue(mockUserEntity);

      const result = await service.findById(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['orders'],
      });
      expect(result).toEqual(mockUserEntity);
    });
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      repository.find.mockResolvedValue([mockUserEntity]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        select: ['id', 'name', 'surname', 'email', 'isActive', 'lastLogin'],
        order: { id: 'DESC' },
      });
      expect(result).toEqual([mockUserEntity]);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      repository.update.mockResolvedValue(undefined);
      repository.findOneBy.mockResolvedValue(mockUserEntity);

      const result = await service.update(1, { name: 'UpdatedName' });

      expect(repository.update).toHaveBeenCalledWith(
        { id: 1 },
        { name: 'UpdatedName' },
      );
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockUserEntity);
    });
  });

  describe('disable', () => {
    it('should disable a user', async () => {
      const userIdToBan = 1;
      const disabledUser = {
        ...mockUserEntity,
        id: userIdToBan,
        isActive: false,
      } as UserEntity;

      repository.findOneBy.mockResolvedValue(disabledUser);
      repository.save.mockResolvedValue(disabledUser);

      const result = await service.disable(userIdToBan, mockAdminUser);

      expect(repository.save).toHaveBeenCalled();
      expect(result.isActive).toBe(false);
    });

    it('should throw ForbiddenException if current user is not an admin', async () => {
      await expect(service.disable(1, mockManagerUser)).rejects.toThrow(
        'Only the administrator can ban users',
      );
    });

    it('should throw BadRequestException if admin tries to ban themselves', async () => {
      const adminId = mockAdminUser.id;

      await expect(service.disable(adminId, mockAdminUser)).rejects.toThrow(
        'You cannot ban yourself',
      );
    });

    it('should throw NotFoundException when user does not exist during disable', async () => {
      const nonExistentId = 999;
      repository.findOneBy.mockResolvedValue(null);

      await expect(
        service.disable(nonExistentId, mockAdminUser),
      ).rejects.toThrow(
        new NotFoundException(`User #${nonExistentId} not found`),
      );

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: nonExistentId });
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('enable', () => {
    it('should enable a user when called by admin', async () => {
      const userId = 1;
      const enabledUser = {
        ...mockUserEntity,
        id: userId,
        isActive: true,
      } as UserEntity;

      repository.findOneBy.mockResolvedValue(enabledUser);
      repository.save.mockResolvedValue(enabledUser);

      const result = await service.enable(userId, mockAdminUser);

      expect(result.isActive).toBe(true);
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if non-admin tries to unban', async () => {
      await expect(service.enable(1, mockManagerUser)).rejects.toThrow(
        'Only the administrator can unban users',
      );
    });

    it('should throw NotFoundException when admin tries to enable a non-existing user', async () => {
      const nonExistentId = 999;
      repository.findOneBy.mockResolvedValue(null);

      await expect(
        service.enable(nonExistentId, mockAdminUser),
      ).rejects.toThrow(
        new NotFoundException(`User #${nonExistentId} not found`),
      );

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: nonExistentId });
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const deleteResult: DeleteResult = {
        raw: [],
        affected: 1,
      };

      repository.delete.mockResolvedValue(deleteResult);

      await expect(service.delete(1)).resolves.not.toThrow();

      expect(repository.delete).toHaveBeenCalledWith(1);
    });
    it('should throw NotFoundException when deleting a non-existing user', async () => {
      const deleteResult: DeleteResult = {
        raw: [],
        affected: 0,
      };

      repository.delete.mockResolvedValue(deleteResult);

      await expect(service.delete(999)).rejects.toThrow('User #999 not found');

      expect(repository.delete).toHaveBeenCalledWith(999);
    });
  });
});
