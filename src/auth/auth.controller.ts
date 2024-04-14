import { Controller, Post, UseGuards, Request, HttpCode } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RefreshJwtGuard, LocalAuthGuard } from './guard';
import { LoginDto, LoginResponseDto, RefreshTokenDto, RefreshTokenResponseDto } from './dto';

@Controller('auth')
@UseGuards(ThrottlerGuard)
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'login for an existing post' })
  @ApiOkResponse({ description: 'success', type: LoginResponseDto })
  @ApiNotFoundResponse({ description: 'user not found' })
  @ApiForbiddenResponse({ description: 'account is deactivated' })
  @ApiUnauthorizedResponse({ description: 'invalid password' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({
    required: true,
    type: LoginDto,
  })
  async login(@Request() req) {
    // This function and refresh token function use req.user.id not userID because it comes from findByUsername from db
    return await this.authService.login(req.user.id, req.user);
  }

  @Post('refresh-token')
  @UseGuards(RefreshJwtGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(200)
  @ApiOperation({ summary: 'Get a new access_token for a previous authorized user' })
  @ApiOkResponse({ description: 'success', type: RefreshTokenResponseDto })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({
    required: true,
    type: RefreshTokenDto,
  })
  async refreshToken(@Request() req) {
    return await this.authService.refreshToken(req.user.id, req.user);
  }
}
