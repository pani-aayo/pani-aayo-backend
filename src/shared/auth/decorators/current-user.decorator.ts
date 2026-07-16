import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { IAuth } from '../token.service';

export const AuthUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): IAuth => {
  const request = ctx.switchToHttp().getRequest<Request>();
  return request.user as IAuth;
});
