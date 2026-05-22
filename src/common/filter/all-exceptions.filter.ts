import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

interface ErrorBody {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}

@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.resolveStatus(exception);
    const message = this.resolveMessage(exception, status);
    const error = HttpStatus[status] ?? 'Error';

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    if (this.prefersHtml(request)) {
      if (status === Number(HttpStatus.NOT_FOUND)) {
        response.status(status).render('view/pages/errors/not-found', {
          pageTitle: 'قالب آموزشی نابغه - ۴۰۴',
        });
        return;
      }

      response.status(status).render('view/pages/errors/error', {
        pageTitle: `نابغه — ${status}`,
        statusCode: status,
        title: error,
        message: Array.isArray(message) ? message.join(', ') : message,
      });
      return;
    }

    const body: ErrorBody = {
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
    response.status(status).json(body);
  }

  private resolveStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private resolveMessage(
    exception: unknown,
    status: number,
  ): string | string[] {
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'string') {
        return res;
      }
      if (typeof res === 'object' && res !== null && 'message' in res) {
        const msg = (res as { message?: string | string[] }).message;
        if (msg !== undefined) {
          return msg;
        }
      }
    }
    if (exception instanceof Error) {
      return exception.message;
    }
    return status >= 500 ? 'Internal server error' : 'Unexpected error';
  }

  private prefersHtml(request: Request): boolean {
    const accept = request.headers.accept ?? '';
    if (accept.includes('application/json') && !accept.includes('text/html')) {
      return false;
    }
    return true;
  }
}
