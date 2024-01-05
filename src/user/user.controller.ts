import { Controller, Post, Body, Patch, Get, Param, Delete, HttpCode } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async register(@Body() userBody: CreateUserDto) {
    const user = await this.userService.create(userBody);
    return { message: 'user created successfully', data: { user } };
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() updateBody: UpdateUserDto) {
    const user = await this.userService.update(id, updateBody);
    return { message: 'user updated successfully', data: { user } };
  }

  @Get('/:id')
  async get(@Param('id') id: string) {
    const user = await this.userService.get(id);
    return { message: 'user retrieved successfully', data: { user } };
  }

  @Delete('/:id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    await this.userService.delete(id);
  }
}
