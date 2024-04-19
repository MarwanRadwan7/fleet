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
} from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';

import { ChatService } from './chat.service';
import { JwtGuard } from 'src/auth/guard';
import { PageOptionsDto } from 'src/common/dto/pagination';
import { CreatePrivateRoomDto, CreatePublicRoomDto, UpdateMessageDto } from './dto';

@UsePipes(new ValidationPipe())
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/rooms/private')
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
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
  async createPublicRoom(@Body() payload: CreatePublicRoomDto) {
    const pubRoom = await this.chatService.createPublicRoom(payload);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'public chat room created successfully',
      data: { pubRoom },
    };
  }

  // TODO: Paginate this endpoint
  @Get('/rooms')
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  async findAllRooms(@Req() req, @Query() pageOptionsDto: PageOptionsDto) {
    const rooms = await this.chatService.findMyRooms(req.user.userID, pageOptionsDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'chat rooms retrieved successfully',
      data: { rooms },
    };
  }

  @Get('rooms/:id/messages')
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  async findRoomMessages(@Param('id') roomId: string, @Query() pageOptionsDto: PageOptionsDto) {
    const msgs = await this.chatService.findRoomMessages(roomId, pageOptionsDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'room messages retrieved successfully',
      data: { msgs },
    };
  }

  @Patch('messages/:id')
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  async updateMessage(
    @Req() req,
    @Param('id') msgId: string,
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

  @Delete('messages/:id')
  @HttpCode(204)
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  async deleteMessage(@Req() req, @Param('id') msgId: string) {
    await this.chatService.deleteMessage(req.user.userID, msgId);
  }
}
