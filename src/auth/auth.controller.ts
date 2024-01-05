import { Controller, Post, UseGuards, Request, HttpCode } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RefreshJwtGuard, LocalAuthGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh-token')
  @HttpCode(200)
  async refreshToken(@Request() req) {
    return await this.authService.refreshToken(req.user);
  }
}
