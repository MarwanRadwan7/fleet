import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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
    try {
      const user = await this.userService.getByUsername(username);

      if (!user) return null;

      // Account is deactivated
      if (!user['is_active'])
        throw new HttpException('account is deactivated', HttpStatus.FORBIDDEN);

      if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      const passwordValid = await bcrypt.compare(password, user.password);

      if (user && passwordValid) {
        delete user.password;
        return user;
      }

      // Password is incorrect
      throw new HttpException('invalid password', HttpStatus.UNAUTHORIZED);
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }
  async login(userId: string, user: LoginDto): Promise<LoginResponseDto> {
    const payload = { id: userId, sub: { username: user.username } };
    return {
      access_token: {
        token: await this.jwtService.signAsync(payload),
        expires_in: '1h',
      },
      refresh_token: await this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    };
  }

  async refreshToken(userId: string, user: LoginDto): Promise<RefreshTokenResponseDto> {
    const payload = { id: userId, sub: { username: user.username } };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
