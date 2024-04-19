import { Body, Controller, Req, UseGuards, Post, Delete, HttpCode, Param } from '@nestjs/common';

import { JwtGuard } from 'src/auth/guard';
import { FollowService } from './follow.service';
import { CreateFollowDto, DeleteFollowDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('follow')
@ApiTags('Follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post('/')
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Follows a user' })
  @ApiCreatedResponse({
    description: 'user followed successfully',
  })
  @ApiNotFoundResponse({ description: 'user not fount' })
  @ApiBadRequestResponse({ description: 'you cannot follow yourself' })
  @ApiConflictResponse({ description: 'you are blocked. you cannot follow this user' })
  @ApiConflictResponse({ description: 'user is already followed' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({
    required: true,
    type: CreateFollowDto,
  })
  async follow(@Req() req, @Body() followBody: CreateFollowDto) {
    await this.followService.follow(req.user.userID, followBody);
    return { statusCode: 201, message: 'user followed successfully' };
  }

  @Delete('/:user_id')
  @UseGuards(JwtGuard)
  @HttpCode(204)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiNoContentResponse({ description: 'user unfollowed successfully' })
  @ApiBadRequestResponse({ description: 'you cannot unfollow yourself' })
  @ApiNotFoundResponse({ description: 'user not found' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async unFollow(@Req() req, @Param('user_id') followingId: string) {
    const userId = req.user.userID;
    const payload: DeleteFollowDto = { followingId };
    await this.followService.unFollow(userId, payload);
  }
}
