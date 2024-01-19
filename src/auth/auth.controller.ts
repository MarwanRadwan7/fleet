import { Controller, Post, UseGuards, Request, HttpCode } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { RefreshJwtGuard, LocalAuthGuard } from './guard';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @UseGuards(RefreshJwtGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('refresh-token')
  @HttpCode(200)
  async refreshToken(@Request() req) {
    return await this.authService.refreshToken(req.user);
  }
}
