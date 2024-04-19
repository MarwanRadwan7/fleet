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
  ClassSerializerInterceptor,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ThrottlerGuard } from '@nestjs/throttler';

import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';
import { ParsePipe, SharpTransformPipe } from 'src/common/pipe';
import { GetPostsByUserResponseDto, GetPostsByUserResponseDtoExample } from 'src/modules/post/dto';
import { PostService } from 'src//modules/post/post.service';
import {
  CreateUserDto,
  CreateUserResponseExample,
  GetUserFollowersResponseDto,
  GetUserFollowersResponseDtoExample,
  GetUserFollowingsResponseDto,
  GetUserFollowingsResponseDtoExample,
  GetUserResponseDtoExample,
  UpdateUserDto,
  UpdateUserResponseDtoExample,
  UserDto,
} from './dto';
import { PageOptionsDto } from 'src/common/dto/pagination';

@Controller('users')
@UseInterceptors(CacheInterceptor)
@UseGuards(ThrottlerGuard)
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  @Post('/')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'user registered successfully',
    type: CreateUserResponseExample,
  })
  @ApiConflictResponse({ description: 'email or username address already registered' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    type: CreateUserDto,
  })
  @UseInterceptors(FileInterceptor('avatar'))
  @UseInterceptors(ClassSerializerInterceptor)
  async register(
    @UploadedFile(ParsePipe, SharpTransformPipe)
    avatar: Express.Multer.File,
    @Body() payload: CreateUserDto,
  ) {
    const user = await this.userService.register(payload, avatar);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'user registered successfully',
      data: { user },
    };
  }

  @Patch('/:user_id')
  @UseGuards(JwtGuard)
  // @UseInterceptors(ClassSerializerInterceptor)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Updates an existing user' })
  @ApiOkResponse({ description: 'user updated successfully', type: UpdateUserResponseDtoExample })
  @ApiNotFoundResponse({ description: 'user not found' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({
    required: true,
    type: UpdateUserDto,
  })
  async update(@Param('user_id') userId: string, @Body() payload: UpdateUserDto) {
    const user: any = await this.userService.update(userId, payload);
    return { statusCode: HttpStatus.OK, message: 'user updated successfully', data: { user } };
  }

  @Get('/:user_id')
  @CacheTTL(20_000)
  @UseGuards(JwtGuard)
  // @UseInterceptors(ClassSerializerInterceptor)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Gets an existing user by ID' })
  @ApiOkResponse({
    description: 'user retrieved successfully',
    type: GetUserResponseDtoExample,
  })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiNotFoundResponse({ description: 'user not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async get(@Param('user_id') user_id: string) {
    const user: UserDto = await this.userService.getById(user_id);
    return { statusCode: HttpStatus.OK, message: 'user retrieved successfully', data: { user } };
  }

  @Get('/:user_id/followers')
  @CacheTTL(20_000)
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: "Gets an existing user's followers" })
  @ApiOkResponse({
    description: 'followers retrieved successfully',
    type: GetUserFollowersResponseDtoExample,
  })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiNotFoundResponse({ description: 'user not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getUserFollowers(
    @Query() pageOptionsDto: PageOptionsDto,
    @Param('user_id') userId: string,
  ) {
    const followers: GetUserFollowersResponseDto = await this.userService.getUserFollowers(
      userId,
      pageOptionsDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'followers retrieved successfully',
      data: { ...followers },
    };
  }

  @Get('/:user_id/followings')
  @CacheTTL(20_000)
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: "Gets an existing user's followings" })
  @ApiOkResponse({
    description: 'followings retrieved successfully',
    type: GetUserFollowingsResponseDtoExample,
  })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiNotFoundResponse({ description: 'user not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getUserFollowings(
    @Query() pageOptionsDto: PageOptionsDto,
    @Param('user_id') userId: string,
  ) {
    const followings: GetUserFollowingsResponseDto = await this.userService.getUserFollowings(
      userId,
      pageOptionsDto,
    );
    return {
      statusCode: 200,
      message: 'followings retrieved successfully',
      data: { ...followings },
    };
  }

  @Get('/:user_id/posts')
  @CacheTTL(10_000)
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: "Gets an existing user 's posts" })
  @ApiOkResponse({
    description: 'posts retrieved successfully',
    type: GetPostsByUserResponseDtoExample,
  })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiNotFoundResponse({ description: 'user not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getUserPosts(@Query() pageOptionsDto: PageOptionsDto, @Param('user_id') userId: string) {
    const posts: GetPostsByUserResponseDto = await this.postService.getPostsByUser(
      userId,
      pageOptionsDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'posts retrieved successfully',
      data: { ...posts },
    };
  }

  @Delete('/:user_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: "Deactivates an existing user 's account" })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiNotFoundResponse({ description: 'user not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async delete(@Param('user_id') userId: string) {
    await this.userService.deactivate(userId);
  }
}
