import { UserRepository } from '../../repository/services/user.repository';
import { mockUserRepository } from './user-repository.mock';
import { TokenRepository } from '../../repository/services/token.repository';
import { mockTokenRepository } from '../../auth/__mocks__/token-repository.mock';
import { JwtService } from '@nestjs/jwt';
import { mockJwtService } from '../../auth/__mocks__/jwt-service.mock';
import { ConfigService } from '@nestjs/config';
import { mockConfigService } from '../../auth/__mocks__/config-service.mock';
import { Provider } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { mockUserService } from './user-service.mock';
import { OrdersService } from '../../orders/services/order.service';
import { mockOrdersService } from '../../orders/__mocks__/orders-service.mock';
import { EntityManager } from 'typeorm';
import { mockEntityManager } from '../../orders/__mocks__/entity-manager.mock';
import { OrdersRepository } from '../../repository/services/orders.repository';
import { mockOrderRepository } from '../../orders/__mocks__/order-repository.mock';

export const usersModuleProviders: Provider[] = [
  {
    provide: UserRepository,
    useValue: mockUserRepository,
  },
  {
    provide: TokenRepository,
    useValue: mockTokenRepository,
  },
  {
    provide: OrdersRepository,
    useValue: mockOrderRepository,
  },
  {
    provide: UserService,
    useValue: mockUserService,
  },
  {
    provide: OrdersService,
    useValue: mockOrdersService,
  },
  {
    provide: JwtService,
    useValue: mockJwtService,
  },
  {
    provide: ConfigService,
    useValue: mockConfigService,
  },
  {
    provide: EntityManager,
    useValue: mockEntityManager,
  },
];
