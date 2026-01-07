import { Test } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { UserRepository } from '../../repository/services/user.repository';
import { mockUserRepository } from '../__mocks__/user-repository.mock';
import { MockServiceType } from '../../../../test/types/mock-service.type';
import { mockUserEntity } from '../__mocks__/user-entity.mock';
import { mockBaseUserReqDto } from '../__mocks__/user-base-dto.mock';
import { UserEntity } from '../../../database/entities/user.entity';
import { mockUserResDto } from '../__mocks__/user-res-dto.mock';
import { DeleteResult } from 'typeorm';

describe('UsersService', () => {
  let service: UserService;
  let repository: MockServiceType<UserRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
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
        select: ['id', 'name', 'surname', 'email'],
        order: { surname: 'ASC' },
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
      const disabledUser = { ...mockUserEntity, isActive: false } as UserEntity;
      repository.findOneBy.mockResolvedValue(mockUserEntity);
      repository.save.mockResolvedValue(disabledUser);

      const result = await service.disable(1);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.save).toHaveBeenCalledWith(disabledUser);
      expect(result).toEqual(mockUserResDto);
    });

    it('should throw NotFoundException when disabling a non-existing user', async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.disable(999)).rejects.toThrow('User #999 not found');

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 999 });
      expect(repository.save).not.toHaveBeenCalled();
    });
  });
  describe('enable', () => {
    it('should enable a user', async () => {
      const enabledUser = { ...mockUserEntity, isActive: true } as UserEntity;
      repository.findOneBy.mockResolvedValue(mockUserEntity);
      repository.save.mockResolvedValue(enabledUser);

      const result = await service.enable(1);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.save).toHaveBeenCalledWith(enabledUser);
      expect(result).toEqual(mockUserResDto);
    });
    it('should throw NotFoundException when enabling a non-existing user', async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.enable(999)).rejects.toThrow('User #999 not found');

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 999 });
      expect(repository.save).not.toHaveBeenCalled();
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
