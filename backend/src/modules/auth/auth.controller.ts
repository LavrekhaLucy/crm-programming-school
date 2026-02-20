import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LoginReqDto } from './dto/req/login.req.dto';
import { RefreshTokenDto } from './models/refresh-token.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserRequest } from './interfaces/user-request.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('register')
  // async register(@Body() registerReqDto: RegisterReqDto) {
  //   return this.authService.register(registerReqDto);
  // }

  @Post('login')
  async login(@Body() loginDto: LoginReqDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto);
  }

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Req() req: UserRequest) {
    return await this.authService.getMe(req.user);
  }

  @Post('logout')
  async logOut(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logOut(refreshTokenDto);
  }
}
