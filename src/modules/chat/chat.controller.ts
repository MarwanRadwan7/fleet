import {
  Body,
  Controller,
  Req,
  Post,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Get,
  Query,
  Param,
  HttpStatus,
  Patch,
  Delete,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ChatService } from './chat.service';
import { JwtGuard } from 'src/auth/guard';
import { PageOptionsDto } from 'src/common/dto/pagination';
import {
  CreatePrivateRoomDto,
  CreatePrivateRoomRespExample,
  CreatePublicRoomDto,
  CreatePublicRoomRespExample,
  UpdateMessageDto,
} from './dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('chat')
@UseInterceptors(CacheInterceptor)
@UsePipes(new ValidationPipe())
@ApiTags('Chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/rooms/private')
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Creates a new private chat room' })
  @ApiCreatedResponse({
    description: 'private chat room created successfully',
    type: CreatePrivateRoomRespExample,
  })
  @ApiNotFoundResponse({ description: 'user not found' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiConflictResponse({ description: 'private room already exist' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({
    required: true,
    type: CreatePrivateRoomDto,
  })
  async createPrivateRoom(@Req() req, @Body() payload: CreatePrivateRoomDto) {
    const prvRoom = await this.chatService.createPrivateRoom(req.user.userID, payload);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'private chat room created successfully',
      data: { prvRoom },
    };
  }

  @Post('/rooms/public')
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Creates a new public chat room' })
  @ApiCreatedResponse({
    description: 'public chat room created successfully',
    type: CreatePublicRoomRespExample,
  })
  @ApiConflictResponse({ description: 'public room already exist' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({
    required: true,
    description: 'The name of the public chat room',
    type: CreatePublicRoomDto,
  })
  async createPublicRoom(@Body() payload: CreatePublicRoomDto) {
    const pubRoom = await this.chatService.createPublicRoom(payload);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'public chat room created successfully',
      data: { pubRoom },
    };
  }

  @Get('/rooms')
  @CacheTTL(20_000)
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: `Get all user's chat rooms` })
  @ApiOkResponse({
    description: 'chat rooms retrieved successfully',
  })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findAllRooms(@Req() req, @Query() pageOptionsDto: PageOptionsDto) {
    const rooms = await this.chatService.findMyRooms(req.user.userID, pageOptionsDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'chat rooms retrieved successfully',
      data: { rooms },
    };
  }

  @Get('rooms/:room_id/messages')
  @CacheTTL(7000)
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: `Get chat room's messages` })
  @ApiOkResponse({
    description: 'room messages retrieved successfully',
  })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findRoomMessages(
    @Param('room_id') roomId: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    const msgs = await this.chatService.findRoomMessages(roomId, pageOptionsDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'room messages retrieved successfully',
      data: { msgs },
    };
  }

  @Patch('messages/:message_id')
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Updates a chat messages' })
  @ApiOkResponse({
    description: 'message updated successfully',
  })
  @ApiBadRequestResponse({ description: 'message does not belong to this user' })
  @ApiNotFoundResponse({ description: 'message not found' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({
    required: true,
    description: 'The content of the message',
    type: UpdateMessageDto,
  })
  async updateMessage(
    @Req() req,
    @Param('message_id') msgId: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    const updatedMsg = await this.chatService.updateMessage(
      req.user.userID,
      msgId,
      updateMessageDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'message updated successfully',
      data: { updatedMsg },
    };
  }

  @Delete('messages/:message_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Deletes a chat messages' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ description: 'message does not belong to this user' })
  @ApiNotFoundResponse({ description: 'message not found' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async deleteMessage(@Req() req, @Param('message_id') msgId: string) {
    await this.chatService.deleteMessage(req.user.userID, msgId);
  }
}
