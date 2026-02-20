import { mockUser } from './user.mock';
import { UserRequest } from '../interfaces/user-request.interface';

export const mockRequest = {
  user: mockUser,
} as Partial<UserRequest>;
