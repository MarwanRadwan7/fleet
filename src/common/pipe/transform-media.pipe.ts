import {
  PipeTransform,
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class SharpTransformPipe implements PipeTransform<any> {
  async transform(value: any) {
    if (value) {
      const buffer = value.buffer;
      if (!buffer) {
        throw new BadRequestException('invalid media format');
      }
      try {
        const transformedBuffer = await sharp(buffer).webp({ quality: 85 }).toBuffer();

        return { ...value, buffer: transformedBuffer };
      } catch (error) {
        throw new InternalServerErrorException('failed to process the media');
      }
    }
  }
}
