import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

import { User } from '../entities/auth.entity';

export const GetUser = createParamDecorator((data: string, ctx: ExecutionContext): User => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user;

  if (!user) {
    throw new InternalServerErrorException('User not found (request)');
  }

  return (!data) ? user : user[data];
});
