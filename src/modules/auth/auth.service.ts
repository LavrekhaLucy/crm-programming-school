import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/services/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../../database/entities/user.entity';

interface JwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...res } = user;
      return res;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  // async login(user: UserEntity) {
  //   const payload: JwtPayload = { email: user.email, sub: user.id };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }

  async login(user: UserEntity) {
    const payload: JwtPayload = { email: user.email, sub: user.id };
    const token = await this.jwtService.signAsync(payload);
    return { access_token: token };
  }
}
