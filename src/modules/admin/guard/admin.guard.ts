import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { UserEntity } from '@modules/auth/entity/user.entity';
import { UserRole } from '@common/enum/user-role.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    if (!req.session?.userId) {
      const returnTo = encodeURIComponent(req.originalUrl);
      res.redirect(`/auth/login?returnTo=${returnTo}`);
      return false;
    }

    const user = await this.dataSource
      .getRepository(UserEntity)
      .findOne({ where: { id: req.session.userId } });

    if (!user || user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('دسترسی ممنوع');
    }

    return true;
  }
}
