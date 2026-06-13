import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request, Response } from 'express';
import { IS_PUBLIC_KEY } from '@modules/auth/decorator/public.decorator';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();
    if (req.session?.userId) {
      return true;
    }

    if (this.prefersHtml(req)) {
      const res = context.switchToHttp().getResponse<Response>();
      const lp: string = res.locals.lp ?? '';
      const returnTo = encodeURIComponent(req.originalUrl);
      res.redirect(`${lp}/auth/login?returnTo=${returnTo}`);
      return false;
    }

    throw new UnauthorizedException('Login required');
  }

  private prefersHtml(req: Request): boolean {
    const accept = req.headers.accept ?? '';
    if (accept.includes('application/json') && !accept.includes('text/html')) {
      return false;
    }
    return true;
  }
}
