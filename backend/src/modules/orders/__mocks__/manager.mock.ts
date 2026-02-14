import { UserEntity } from '../../../database/entities/user.entity';
import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';

export const mockManager = new UserEntity();
mockManager.id = 1;
mockManager.name = 'John';
mockManager.surname = 'Doe';
mockManager.email = 'manager@mail.com';
mockManager.password = '123456';
mockManager.username = 'manager';
mockManager.role = UserRoleEnum.MANAGER;
mockManager.isActive = true;
mockManager.avatarUrl = null;
mockManager.locale = 'en';
mockManager.isAdultAccepted = true;
mockManager.tokens = [];
mockManager.orders = [];
mockManager.comments = [];
