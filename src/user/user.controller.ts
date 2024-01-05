import {
  Controller,
  Post,
  Body,
  Patch,
  Get,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';

import { CreateUserDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  async register(@Body() userBody: CreateUserDto) {
    const user = await this.userService.create(userBody);
    return { statusCode: 201, message: 'user created successfully', data: { user } };
  }

  @Patch('/:id')
  @UseGuards(JwtGuard)
  async update(@Param('id') id: string, @Body() updateBody: UpdateUserDto) {
    const user = await this.userService.update(id, updateBody);
    return { statusCode: 200, message: 'user updated successfully', data: { user } };
  }

  @Get('/:id')
  @UseGuards(JwtGuard)
  async get(@Param('id') id: string) {
    const user = await this.userService.get(id);
    return { statusCode: 200, message: 'user retrieved successfully', data: { user } };
  }

  @Delete('/:id')
  @UseGuards(JwtGuard)
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    await this.userService.delete(id);
  }
}
