import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { AuthService } from '@modules/auth/service/auth.service';
import type { SessionUserPayload } from '@modules/auth/interfaces/auth-session.interface';

export type RequestWithUser = Request & { user?: SessionUserPayload };

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const userId = req.session?.userId;
    if (userId) {
      const user = await this.authService.getSessionUser(userId);
      if (user) {
        req.user = user;
        res.locals.currentUser = this.authService.toViewUser(user);
        res.locals.csrfToken = this.authService.ensureCsrfToken(req);
      } else {
        delete req.session.userId;
      }
    }
    next();
  }
}
