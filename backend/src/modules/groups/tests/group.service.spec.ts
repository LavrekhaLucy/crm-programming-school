import { Test, TestingModule } from '@nestjs/testing';
import { GroupService } from '../services/group.service';
import { GroupRepository } from '../../repository/services/group.repository';
import { CreateGroupDto } from '../models/create-group.dto';
import { groupsModuleProviders } from '../__mocks__/group-module.mock';
import { MockServiceType } from '../../../../test/types/mock-service.type';
import { mockEntityGroup } from '../__mocks__/entity-group.mock';

describe('GroupService', () => {
  let service: GroupService;
  let repository: MockServiceType<GroupRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...groupsModuleProviders],
    }).compile();

    service = module.get<GroupService>(GroupService);
    repository = module.get(GroupRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a group', async () => {
      const dto: CreateGroupDto = { name: 'VIP' };

      repository.create.mockReturnValue(mockEntityGroup);
      repository.save.mockResolvedValue(mockEntityGroup);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(mockEntityGroup);
      expect(result).toEqual(mockEntityGroup);
    });
  });

  describe('findAll', () => {
    it('should return an array of groups', async () => {
      repository.find.mockResolvedValue([mockEntityGroup]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({ order: { name: 'ASC' } });
      expect(result).toEqual([mockEntityGroup]);
    });
  });

  describe('findOne', () => {
    it('should return a single group by id', async () => {
      repository.findOne.mockResolvedValue(mockEntityGroup);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockEntityGroup);
    });

    it('should return null if group does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(result).toBeNull();
    });
  });
});
