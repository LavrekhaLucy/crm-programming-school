import { UsersController } from '../users.controller';
import { Test } from '@nestjs/testing';
import { UserRequest } from '../../auth/interfaces/user-request.interface';
import { mockUserEntity } from '../__mocks__/user-entity.mock';
import { mockBaseUserReqDto } from '../__mocks__/user-base-dto.mock';
import { mockUserService } from '../__mocks__/user-service.mock';
import { usersModuleProviders } from '../__mocks__/users-module.mock';

describe(UsersController.name, () => {
  let usersController: UsersController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [...usersModuleProviders],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user', async () => {
      const mockUserRequest = { user: { userId: 1 } } as UserRequest;
      jest.spyOn(mockUserService, 'findById').mockResolvedValue(mockUserEntity);

      const result = await usersController.getProfile(mockUserRequest);

      expect(mockUserService.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUserEntity);
    });
  });

  describe('create', () => {
    it('should create and return user', async () => {
      jest.spyOn(mockUserService, 'create').mockResolvedValue(mockUserEntity);

      const result = await usersController.create(mockBaseUserReqDto);
      expect(result).toEqual(mockUserEntity);
    });
  });

  describe('delete', () => {
    it('should call service delete with correct id', async () => {
      const id = 1;

      jest.spyOn(mockUserService, 'delete').mockResolvedValue(undefined);
      await usersController.delete(id);

      expect(mockUserService.delete).toHaveBeenCalledWith(id);
      expect(mockUserService.delete).toHaveBeenCalledTimes(1);
    });
  });
});
