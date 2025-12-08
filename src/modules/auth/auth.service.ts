// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { UserEntity } from '../../database/entities/user.entity';
// import { RegisterDto } from './dto/register.dto';
// import { Repository } from 'typeorm';
// import { LoginDto } from './dto/login.dto';
//
// @Injectable()
// export class AuthService {
//   constructor(
//     private userRepository: Repository<UserEntity>,
//     private jwtService: JwtService,
//   ) {}
//
//   async register(registerDto: RegisterDto): Promise<UserEntity> {
//     const user = this.userRepository.create(registerDto);
//     return this.userRepository.save(user);
//   }
//
//   async login(loginDto: LoginDto): Promise<{ access_token: string }> {
//     const user = await this.validateUser(loginDto.username, loginDto.password);
//     const payload = { userId: user.id, username: user.username };
//     return {
//       access_token: this.jwtService.sign(payload),
//     };
//   }
//
//   private async validateUser(
//     username: string,
//     password: string,
//   ): Promise<UserEntity> {
//     const user = await this.userRepository.findOneBy({ username });
//
//     if (!user || !(await user.validatePassword(password))) {
//       throw new UnauthorizedException('Invalid credentials');
//     }
//     return user;
//   }
// }
