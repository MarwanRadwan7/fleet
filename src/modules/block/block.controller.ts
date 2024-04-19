import {
  Body,
  Controller,
  Req,
  UseGuards,
  Post,
  Delete,
  HttpCode,
  Param,
  HttpStatus,
} from '@nestjs/common';
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

import { JwtGuard } from 'src/auth/guard';
import { BlockService } from './block.service';
import { CreateBlockDto } from './dto';

@Controller('block')
@ApiTags('Block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post('/')
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Blocks an existing user' })
  @ApiCreatedResponse({ description: 'user blocked successfully' })
  @ApiBadRequestResponse({ description: 'you cannot block yourself' })
  @ApiConflictResponse({ description: 'user is already blocked' })
  @ApiNotFoundResponse({ description: 'user not found' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({ required: true, type: CreateBlockDto })
  async block(@Req() req, @Body() payload: CreateBlockDto) {
    await this.blockService.block(req.user.userID, payload);
    return { statusCode: HttpStatus.CREATED, message: 'user blocked successfully' };
  }

  @Delete('/:friend_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Unblock a user' })
  @ApiNoContentResponse({ description: 'user unblocked successfully' })
  @ApiBadRequestResponse({ description: 'you cannot unblock yourself' })
  @ApiNotFoundResponse({ description: 'user not found' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async unBlock(@Req() req, @Param('friend_id') friendId: string) {
    await this.blockService.unBlock(req.user.userID, friendId);
  }
}
