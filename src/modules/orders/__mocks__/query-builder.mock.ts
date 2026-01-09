import { UserEntity } from '../../../database/entities/user.entity';
import { SelectQueryBuilder } from 'typeorm';

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
