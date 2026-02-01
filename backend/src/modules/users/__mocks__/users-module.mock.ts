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
import { AuthService } from '../../auth/services/auth.service';
import { mockAuthService } from '../../auth/__mocks__/auth-service.mock';
import { AdminService } from '../../admin/services/admin.service';
import { mockAdminService } from '../../admin/__mocks__/admin-service.mock';
import { CommentsService } from '../../comments/services/comments.service';
import { mockCommentsService } from '../../comments/__mocks__/comments-service.mock';
import { CommentsRepository } from '../../repository/services/comments.repository';

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
    provide: CommentsRepository,
    useValue: mockCommentsService,
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
  {
    provide: AuthService,
    useValue: mockAuthService,
  },
  {
    provide: AdminService,
    useValue: mockAdminService,
  },
  {
    provide: CommentsService,
    useValue: mockCommentsService,
  },
];
