import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentPostDto {
  @ApiProperty({ example: 'example' })
  @IsNotEmpty()
  @IsString()
  content: string;
}
export class UpdateCommentPostResponseDtoExample {
  @ApiProperty({ example: 'cc0dee72-7d82-4310-bdd9' })
  id: string;

  @ApiProperty({ example: 'example' })
  content: string;

  @ApiProperty({ example: 'db11d4ca-c320-444f-afee-142c198a4d6d' })
  userId: string;

  @ApiProperty({ example: 'db11d4ca-c320-444f-afee-142c198a4d6d' })
  postId: string;

  @ApiProperty({ example: false })
  isEdited: boolean;

  @ApiProperty({ example: '2024-02-06T18:44:13.264Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-02-06T18:44:13.264Z' })
  updatedAt: Date;
}
