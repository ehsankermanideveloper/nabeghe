import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request, Response } from 'express';
import { Observable, from, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AppCacheService } from '../cache.service';
import { buildCacheResponseKey } from '../cache-response-key.util';
import { CACHE_RESPONSE_TTL_KEY } from '../decorator/cache-response.decorator';

@Injectable()
export class CacheResponseInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly cache: AppCacheService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ttlSeconds = this.reflector.get<number | undefined>(
      CACHE_RESPONSE_TTL_KEY,
      context.getHandler(),
    );
    if (ttlSeconds === undefined || ttlSeconds <= 0) {
      return next.handle();
    }

    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();
    const url = req.originalUrl ?? req.url;
    const key = buildCacheResponseKey(this.cache, req.method, url);

    res.setHeader('Cache-Control', `public, max-age=${ttlSeconds}`);

    return from(this.cache.get<unknown>(key)).pipe(
      mergeMap((cached) => {
        if (cached !== undefined) {
          return of(cached);
        }

        return next.handle().pipe(
          mergeMap((body) =>
            from(this.cache.set(key, body, ttlSeconds)).pipe(
              mergeMap(() => of(body)),
            ),
          ),
        );
      }),
    );
  }
}
