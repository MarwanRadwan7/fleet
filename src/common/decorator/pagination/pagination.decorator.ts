import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';

import { Pagination } from './pagination.interface';

export const PaginationParams = createParamDecorator((data, ctx: ExecutionContext): Pagination => {
  const req: Request = ctx.switchToHttp().getRequest();
  const page = parseInt(req.query.page as string) || 1;
  const size = parseInt(req.query.size as string) || 15;

  // check if page and size are valid
  if (isNaN(page) || page < 0 || isNaN(size) || size < 0) {
    throw new HttpException('Invalid pagination params', HttpStatus.BAD_REQUEST);
  }
  // Max number to retrieve from the db
  if (size > 30) {
    throw new HttpException('Invalid pagination params: Max size is 100', HttpStatus.BAD_REQUEST);
  }

  // calculate pagination parameters
  const limit = size;
  const offset = (page - 1) * limit;

  return { page, limit, size, offset };
});
