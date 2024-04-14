import {
  Body,
  Controller,
  Req,
  Post,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';

import { ChatService } from './chat.service';
import { CreatePrivateRoomDto, CreatePublicRoomDto } from './dto';
import { JwtGuard } from 'src/auth/guard';

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
      statusCode: 201,
      message: 'private chat room created successfully',
      data: { prvRoom },
    };
  }

  @Post('/rooms/public')
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  async createPublicRoom(@Req() req, @Body() payload: CreatePublicRoomDto) {
    const pubRoom = await this.chatService.createPublicRoom(payload);
    return {
      statusCode: 201,
      message: 'public chat room created successfully',
      data: { pubRoom },
    };
  }

  @Get('/rooms')
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  async findAllRooms(@Req() req) {
    const rooms = await this.chatService.findMyRooms(req.user.userID);
    return {
      statusCode: 200,
      message: 'chat rooms retrieved successfully',
      data: { rooms },
    };
  }
}
