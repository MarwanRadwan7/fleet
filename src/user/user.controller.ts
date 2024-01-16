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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';
import { ParsePipe, SharpTransformPipe } from 'src/common/pipe';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { GetPostsByUserDto } from 'src/post/dto';
import { PostService } from 'src/post/post.service';
import {
  CreateUserDto,
  CreateUserResponseDto,
  GetUserDataDto,
  GetUserFollowersResponseDto,
  GetUserFollowingsResponseDto,
  GetUserResponseDto,
  UpdateUserDto,
  UpdateUserResponseDto,
} from './dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('avatar'))
  async register(
    @UploadedFile(ParsePipe, SharpTransformPipe)
    avatar: Express.Multer.File,
    @Body() payload: CreateUserDto,
  ) {
    let user: CreateUserResponseDto;
    if (avatar) {
      payload['avatar'] = (await this.cloudinaryService.uploadFile(avatar)).secure_url;
      user = await this.userService.create(payload);
    } else {
      user = await this.userService.create(payload);
    }
    return { statusCode: 201, message: 'user created successfully', data: { user } };
  }

  @Patch('/:user_id')
  @UseGuards(JwtGuard)
  async update(@Param('user_id') user_id: string, @Body() payload: UpdateUserDto) {
    const user: UpdateUserResponseDto = await this.userService.update(user_id, payload);
    return { statusCode: 200, message: 'user updated successfully', data: { user } };
  }

  @Get('/:user_id')
  @UseGuards(JwtGuard)
  async get(@Param('user_id') user_id: string) {
    const payload: GetUserDataDto = { user_id };
    const user: GetUserResponseDto = await this.userService.get(payload);
    return { statusCode: 200, message: 'user retrieved successfully', data: { user } };
  }

  @Get('/:user_id/followers')
  @UseGuards(JwtGuard)
  async getUserFollowers(@Param('user_id') user_id: string) {
    const payload: GetUserDataDto = { user_id };
    const followers: GetUserFollowersResponseDto[] =
      await this.userService.getUserFollowers(payload);
    return { statusCode: 200, message: 'followers retrieved successfully', data: { followers } };
  }

  @Get('/:user_id/followings')
  @UseGuards(JwtGuard)
  async getUserFollowings(@Param('user_id') user_id: string) {
    const payload: GetUserDataDto = { user_id };
    const followings: GetUserFollowingsResponseDto[] =
      await this.userService.getUserFollowings(payload);
    return { statusCode: 200, message: 'followings retrieved successfully', data: { followings } };
  }

  @Get('/:user_id/posts')
  @UseGuards(JwtGuard)
  async getUserPosts(@Param('user_id') user_id: string) {
    const payload: GetPostsByUserDto = { user_id };
    const posts = await this.postService.getPostByUser(payload);
    return { statusCode: 200, message: 'posts retrieved successfully', data: { posts } };
  }

  @Delete('/:user_id')
  @UseGuards(JwtGuard)
  @HttpCode(204)
  async delete(@Param('user_id') user_id: string) {
    const payload: GetUserDataDto = { user_id };
    await this.userService.delete(payload);
  }
}
