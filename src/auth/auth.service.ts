import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { UserService } from 'src/user/user.service';
import { LoginResponseDto, RefreshTokenResponseDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.getByUsername(username);
    if (!user) return null;

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!user) {
      throw new NotFoundException('could not find the user');
    }
    if (user && passwordValid) {
      delete user.password;
      return user;
    }
    return null;
  }
  async login(user: LoginDto): Promise<LoginResponseDto> {
    const payload = { id: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    };
  }

  async refreshToken(user: LoginDto): Promise<RefreshTokenResponseDto> {
    const payload = { id: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
