import { UsersController } from '../users.controller';
import { Test } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { UserEntity } from '../../../database/entities/user.entity';
import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';
import { UserRequest } from '../../auth/interfaces/user-request.interface';

describe(UsersController.name, () => {
  let usersController: UsersController;

  let mockUserService: {
    create: jest.Mock;
    findById: jest.Mock;
    delete: jest.Mock;
  };

  const mockUserEntity: Partial<UserEntity> = {
    id: 1,
    email: 'email',
    password: 'password',
    name: 'name',
    surname: 'surname',
    username: 'username',
    role: UserRoleEnum.MANAGER,
    avatarUrl: null,
    isActive: true,
    locale: 'en',
    isAdultAccepted: true,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  } as UserEntity;

  beforeEach(async () => {
    mockUserService = {
      create: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };

    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
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
      const mockBaseUserReqDto = {
        email: 'email',
        password: 'password',
        name: 'name',
        surname: 'surname',
        username: 'username',
        role: UserRoleEnum.MANAGER,
      };

      jest
        .spyOn(mockUserService, 'create')
        .mockResolvedValue(mockUserEntity as UserEntity);

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
