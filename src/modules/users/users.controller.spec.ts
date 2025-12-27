import { UsersController } from './users.controller';
import { Test } from '@nestjs/testing';
import { UserService } from './services/user.service';

describe(UsersController.name, () => {
  let usersController: UsersController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UserService,
          useValue: {},
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });
});
