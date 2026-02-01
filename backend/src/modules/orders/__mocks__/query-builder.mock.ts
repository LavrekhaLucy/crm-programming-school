import { SelectQueryBuilder } from 'typeorm';

export const mockQueryBuilder = <T>(): jest.Mocked<SelectQueryBuilder<T>> => {
  return {
    // selection
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),

    // filtering
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),

    // grouping / sorting
    groupBy: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),

    // pagination
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),

    // execution
    getOne: jest.fn(),
    getMany: jest.fn(),
    getRawMany: jest.fn(),
    getManyAndCount: jest.fn(),
  } as unknown as jest.Mocked<SelectQueryBuilder<T>>;
};
