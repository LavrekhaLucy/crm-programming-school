import { Controller, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserEntity } from '../../database/entities/user.entity';

interface AuthRequest extends Request {
  user: UserEntity;
}
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Request() req: AuthRequest): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }
}
