import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';

import { LoginResponseDto, RefreshTokenResponseDto, LoginDto } from './dto';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.userRepository.findByUsername(username);

      if (!user) return null;

      // Account is deactivated
      if (!user.isActive) throw new HttpException('account is deactivated', HttpStatus.FORBIDDEN);

      if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      const passwordValid = await verify(user.password, password);

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
