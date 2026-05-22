import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { SessionUserPayload } from '@modules/auth/interfaces/auth-session.interface';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): SessionUserPayload | undefined => {
    const req = ctx
      .switchToHttp()
      .getRequest<Request & { user?: SessionUserPayload }>();
    return req.user;
  },
);
