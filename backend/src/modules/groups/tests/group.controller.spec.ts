import { GroupController } from '../group.controller';
import { Test } from '@nestjs/testing';
import { mockResGroup } from '../__mocks__/res-group.mock';
import { groupsModuleProviders } from '../__mocks__/group-module.mock';
import { mockServiceGroup } from '../__mocks__/group-service.mock';

describe(GroupController.name, () => {
  let groupController: GroupController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [GroupController],
      providers: [...groupsModuleProviders],
    }).compile();

    groupController = module.get(GroupController);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(groupController).toBeDefined();
  });
  describe('createGroup', () => {
    it('should create a group', async () => {
      const group = { name: 'VIP' };

      jest.spyOn(mockServiceGroup, 'create').mockResolvedValue(mockResGroup);

      const result = await groupController.create(group);

      expect(mockServiceGroup.create).toHaveBeenCalledWith(group);
      expect(result).toEqual(mockResGroup);
    });
  });
  describe('findAllGroups', () => {
    it('should find all group', async () => {
      jest.spyOn(mockServiceGroup, 'findAll').mockResolvedValue([mockResGroup]);
      const result = await groupController.findAll();

      expect(mockServiceGroup.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockResGroup]);
    });
  });
  describe('findGroup', () => {
    it('should find a group', async () => {
      jest.spyOn(mockServiceGroup, 'findOne').mockResolvedValue(mockResGroup);
      const result = await groupController.findOne(1);

      expect(mockServiceGroup.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResGroup);
    });
  });
});
