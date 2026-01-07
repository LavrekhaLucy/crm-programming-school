import { AuthService } from '../services/auth.service';
import { Test } from '@nestjs/testing';
import { UserRepository } from '../../repository/services/user.repository';
import { mockUserRepository } from '../../users/__mocks__/user-repository.mock';
import { mockEntityManager } from '../../orders/__mocks__/entity-manager.mock';
import { EntityManager } from 'typeorm';
import { TokenRepository } from '../../repository/services/token.repository';
import { mockTokenRepository } from '../__mocks__/token.repository.mock';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { mockJwtService } from '../__mocks__/jwt-service.mock';
import { mockConfigService } from '../__mocks__/config.service.mock';

describe('AuthService', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: TokenRepository,
          useValue: mockTokenRepository,
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
      ],
    }).compile();

    service = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('register', () => {
    // it('should register a new user and return UserResDto', async () => {
    //   mockUserRepository.create.mockResolvedValue(mockBaseUserReqDto);
    // });
  });
});
