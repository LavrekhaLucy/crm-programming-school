// import { Test } from '@nestjs/testing';
// import { UserService } from '../services/user.service';
// import { UserRepository } from '../../repository/services/user.repository';
// import { mockUserRepository } from '../../repository/__mocks__/user-repository.mock';
// import { MockServiceType } from '../../../../test/types/mock-service.type';
// import { BaseUserReqDto } from '../models/dto/req/user-base.req.dto';
//
// describe('UsersService', () => {
//   let service: UserService;
//   let repository: MockServiceType<UserRepository>;
//
//   beforeEach(async () => {
//     const module = await Test.createTestingModule({
//       providers: [
//         UserService,
//         {
//           provide: UserRepository,
//           useValue: mockUserRepository,
//         },
//       ],
//     }).compile();
//
//     service = module.get(UserService);
//     repository = module.get(UserRepository);
//   });
//
//   afterEach(() => {
//     jest.clearAllMocks();
//   });
//
//   it('should create a new user', async () => {
//     const mockCreateUserDto: BaseUserReqDto = {
//       username: 'John Doe',
//       name: 'John',
//
//       surname: 'Doe',
//       email: 'email',
//       password: 'password123',
//     };
//
//     repository.save.mockResolvedValue(mockCreateUserDto);
//
//     const result = await service.create(mockCreateUserDto);
//
//     expect(result).toHaveProperty('id');
//     expect(repository.save).toHaveBeenCalledWith(mockCreateUserDto);
//   });
// });
