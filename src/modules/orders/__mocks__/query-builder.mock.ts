import { UserEntity } from '../../../database/entities/user.entity';
import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';
import { SelectQueryBuilder } from 'typeorm';

export const validatePasswordMock = jest.fn();

export const mockUser: Partial<UserEntity> = {
  id: 1,
  username: 'test',
  password: 'hashedPassword',
  role: UserRoleEnum.MANAGER,
  validatePassword: validatePasswordMock,
};

export const mockQueryBuilder: jest.Mocked<SelectQueryBuilder<UserEntity>> = {
  select: jest.fn().mockReturnThis(),
  addSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  getOne: jest.fn(),
  getRawMany: jest.fn(),
} as unknown as jest.Mocked<SelectQueryBuilder<UserEntity>>;
