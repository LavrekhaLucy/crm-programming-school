import { AuthService } from '../services/auth.service';
import { Test } from '@nestjs/testing';
import { UserRepository } from '../../repository/services/user.repository';
import { mockUserRepository } from '../../users/__mocks__/user-repository.mock';
import { mockEntityManager } from '../../orders/__mocks__/entity-manager.mock';
import { EntityManager } from 'typeorm';
import { TokenRepository } from '../../repository/services/token.repository';
import { mockTokenRepository } from '../__mocks__/token-repository.mock';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { mockJwtService } from '../__mocks__/jwt-service.mock';
import { mockConfigService } from '../__mocks__/config-service.mock';
import { mockBaseUserReqDto } from '../../users/__mocks__/user-base-dto.mock';
import { mockUserEntity } from '../../users/__mocks__/user-entity.mock';
import { mockLoginDto } from '../__mocks__/login-dto.mock';
import { mockQueryBuilder } from '../../orders/__mocks__/query-builder.mock';
import { MockServiceType } from '../../../../test/types/mock-service.type';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: MockServiceType<UserRepository>;
  let jwtService: Partial<JwtService>;

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
    userRepository = module.get(UserRepository);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('register', () => {
    it('should register a new user and return UserResDto', async () => {
      mockUserRepository.create.mockReturnValue(mockUserEntity);
      mockUserRepository.save.mockResolvedValue(mockUserEntity);

      const result = await service.register(mockBaseUserReqDto);

      expect(mockUserRepository.create).toHaveBeenCalledWith(
        mockBaseUserReqDto,
      );
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUserEntity);
      expect(result).toEqual({
        id: mockUserEntity.id,
        email: mockUserEntity.email,
        role: mockUserEntity.role,
        name: mockUserEntity.name,
        avatarUrl: mockUserEntity.avatarUrl,
        locale: mockUserEntity.locale,
        isAdultAccepted: mockUserEntity.isAdultAccepted,
      });
    });
  });
  describe('login', () => {
    it('should login a user and return tokens', async () => {
      // Мок createQueryBuilder
      (userRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder as any,
      );
      mockQueryBuilder.getOne.mockResolvedValue({
        ...mockUserEntity,
        validatePassword: jest.fn().mockResolvedValue(true),
      });

      // Мок jwtService
      (jwtService.sign as jest.Mock).mockReturnValue('signedToken');

      const result = await service.login(mockLoginDto);

      expect(userRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith('user.password');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'user.username = :login OR user.email = :login',
        { login: mockLoginDto.login },
      );

      expect(jwtService.sign).toHaveBeenCalledTimes(2);

      expect(mockEntityManager.transaction).toHaveBeenCalled();
      expect(result).toEqual({
        accessToken: 'signedToken',
        refreshToken: 'signedToken',
      });
    });
  });
});
