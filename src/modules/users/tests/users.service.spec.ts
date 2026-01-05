import { Test } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { UserRepository } from '../../repository/services/user.repository';
import { mockUserRepository } from '../__mocks__/user-repository.mock';
import { MockServiceType } from '../../../../test/types/mock-service.type';
import { mockUserEntity } from '../__mocks__/user-entity.mock';
import { mockBaseUserReqDto } from '../__mocks__/user-base-dto.mock';

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

  it('should create a new user', async () => {
    jest.spyOn(repository, 'create').mockReturnValue(mockUserEntity);
    repository.save.mockResolvedValue(mockUserEntity);

    const result = await service.create(mockBaseUserReqDto);

    expect(repository.create).toHaveBeenCalledWith(mockBaseUserReqDto);
    expect(repository.save).toHaveBeenCalledWith(mockUserEntity);
    expect(result).toHaveProperty('id', 1);
    expect(result).toEqual(mockUserEntity);
  });
  it('should find a user by id', async () => {
    repository.findOne.mockResolvedValue(mockUserEntity);

    const result = await service.findById(1);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['orders'],
    });
    expect(result).toEqual(mockUserEntity);
  });

  it('should find all users', async () => {
    repository.find.mockResolvedValue([mockUserEntity]);

    const result = await service.findAll();

    expect(repository.find).toHaveBeenCalledWith({
      select: ['id', 'name', 'surname', 'email'],
      order: { surname: 'ASC' },
    });
    expect(result).toEqual([mockUserEntity]);
  });
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

  //
  // it('should disable a user', async () => {
  //   const disabledUser = { ...mockUserEntity, isActive: false }; // <-- повний entity
  //   repository.findOneBy.mockResolvedValue(mockUserEntity);
  //   repository.save.mockResolvedValue(disabledUser);
  //
  //   const result = await service.disable(1);
  //
  //   expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  //   expect(repository.save).toHaveBeenCalledWith(disabledUser);
  //   expect(result).toEqual(disabledUser);
  // });
});
