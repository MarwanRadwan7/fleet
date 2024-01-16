import { Injectable, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';

@Injectable()
export class ParsePipe extends ParseFilePipe {
  constructor() {
    super({
      fileIsRequired: false,
      validators: [
        new MaxFileSizeValidator({ maxSize: 2621440 }),
        new FileTypeValidator({ fileType: /image\/(jpeg|jpg|png|gif|bmp|webp|tiff|tif|svg)$/i }),
      ],
    });
  }
}
