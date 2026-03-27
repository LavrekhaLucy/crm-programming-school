import { Test, TestingModule } from '@nestjs/testing';
import { GroupService } from '../services/group.service';
import { CreateGroupDto } from '../models/create-group.dto';
import { mockEntityGroup } from '../__mocks__/entity-group.mock';
import { mockRepositoryGroup } from '../__mocks__/group-repository.mock';
import { GroupRepository } from '../../repository/services/group.repository';
import { ConflictException } from '@nestjs/common';

describe('GroupService', () => {
  let service: GroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        {
          provide: GroupRepository,
          useValue: mockRepositoryGroup,
        },
      ],
    }).compile();

    service = module.get(GroupService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateGroupDto = { name: 'VIP' };
    it('should create and save a group', async () => {
      mockRepositoryGroup.findOneBy.mockResolvedValue(null);
      mockRepositoryGroup.create.mockReturnValue(mockEntityGroup);
      mockRepositoryGroup.save.mockResolvedValue(mockEntityGroup);

      const result = await service.create(dto);

      expect(mockRepositoryGroup.findOneBy).toHaveBeenCalledWith(dto);
      expect(mockRepositoryGroup.save).toHaveBeenCalledWith(mockEntityGroup);
      expect(result).toEqual(mockEntityGroup);
    });
    it('should throw a ConflictException if the group already exists ', async () => {
      mockRepositoryGroup.findOneBy.mockResolvedValue(mockEntityGroup);
      await expect(service.create(dto)).rejects.toThrow(
        new ConflictException('Group already exists'),
      );
      expect(mockRepositoryGroup.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of groups', async () => {
      mockRepositoryGroup.find.mockResolvedValue([mockEntityGroup]);

      const result = await service.findAll();

      expect(mockRepositoryGroup.find).toHaveBeenCalledWith({
        order: { name: 'ASC' },
      });
      expect(result).toEqual([mockEntityGroup]);
    });
  });

  describe('findOne', () => {
    it('should return a single group by id', async () => {
      mockRepositoryGroup.findOne.mockResolvedValue(mockEntityGroup);

      const result = await service.findOne(1);

      expect(mockRepositoryGroup.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockEntityGroup);
    });

    it('should return null if group does not exist', async () => {
      mockRepositoryGroup.findOne.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(mockRepositoryGroup.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(result).toBeNull();
    });
  });
});
