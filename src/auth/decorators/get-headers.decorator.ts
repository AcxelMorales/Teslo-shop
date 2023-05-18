import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const RawHeaders = createParamDecorator((_, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const rawHeaders = req.rawHeaders;

  if (!rawHeaders) {
    throw new InternalServerErrorException('User not found (request)');
  }

  return rawHeaders;
});
