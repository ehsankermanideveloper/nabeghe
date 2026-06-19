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

interface StatusMeta {
  pageTitleKey: string;
  titleKey: string;
  descKey: string;
}

const STATUS_META: Record<number, StatusMeta> = {
  [HttpStatus.NOT_FOUND]: {
    pageTitleKey: 'page_title_not_found',
    titleKey: 'error_not_found',
    descKey: 'error_not_found_hint',
  },
  [HttpStatus.FORBIDDEN]: {
    pageTitleKey: 'page_title_forbidden',
    titleKey: 'error_forbidden_title',
    descKey: 'error_forbidden_desc',
  },
  [HttpStatus.UNAUTHORIZED]: {
    pageTitleKey: 'page_title_forbidden',
    titleKey: 'error_forbidden_title',
    descKey: 'error_login_required',
  },
  [HttpStatus.INTERNAL_SERVER_ERROR]: {
    pageTitleKey: 'page_title_error',
    titleKey: 'error_server_title',
    descKey: 'error_server_desc',
  },
};

const DEFAULT_META: StatusMeta = {
  pageTitleKey: 'page_title_error',
  titleKey: 'error_generic_title',
  descKey: 'error_generic_desc',
};

@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (response.headersSent) {
      return;
    }

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
      const t = (response.locals.t as ((key: string) => string) | undefined) ?? ((k: string) => k);
      const meta = STATUS_META[status] ?? DEFAULT_META;

      if (status === HttpStatus.NOT_FOUND) {
        response.status(status).render('view/pages/errors/not-found', {
          layout: 'view/layout',
          pageTitle: t(meta.pageTitleKey),
        });
        return;
      }

      response.status(status).render('view/pages/errors/error', {
        layout: 'view/layout',
        pageTitle: t(meta.pageTitleKey),
        statusCode: status,
        title: t(meta.titleKey),
        desc: t(meta.descKey),
        rawMessage: status < 500 ? null : (Array.isArray(message) ? message.join(', ') : message),
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

  private resolveMessage(exception: unknown, status: number): string | string[] {
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'string') return res;
      if (typeof res === 'object' && res !== null && 'message' in res) {
        const msg = (res as { message?: string | string[] }).message;
        if (msg !== undefined) return msg;
      }
    }
    if (exception instanceof Error) return exception.message;
    return status >= 500 ? 'Internal server error' : 'Unexpected error';
  }

  private prefersHtml(request: Request): boolean {
    const accept = request.headers.accept ?? '';
    if (accept.includes('application/json') && !accept.includes('text/html')) return false;
    return true;
  }
}
