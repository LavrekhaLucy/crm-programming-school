// import {
//   ArgumentsHost,
//   BadRequestException,
//   Catch,
//   ExceptionFilter,
//   HttpException,
// } from '@nestjs/common';
//
// import { Request, Response } from 'express';
//
// @Catch()
// export class GlobalExceptionFilter implements ExceptionFilter {
//   constructor() {}
//
//   catch(exception: any, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();
//
//     const status =
//       exception instanceof HttpException ? exception.getStatus() : 500;
//
//     const message =
//       exception instanceof BadRequestException
//         ? (exception.getResponse() as any)?.message || 'Bad request'
//         : exception.message || 'Internal server error';
//
//     response.status(status).json({
//       statusCode: status,
//       messages: Array.isArray(message) ? message : [message],
//       timestamp: new Date().toISOString(),
//       path: request.url,
//     });
//   }
// }

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

// @Catch()
// export class GlobalExceptionFilter implements ExceptionFilter {
//   constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
//
//   catch(exception: any, host: ArgumentsHost): void {
//     // In certain situations `httpAdapter` might not be available in the
//     // constructor method, thus we should resolve it here.
//     const { httpAdapter } = this.httpAdapterHost;
//
//     const ctx = host.switchToHttp();
//
//     const httpStatus =
//       exception instanceof HttpException
//         ? exception.getStatus()
//         : HttpStatus.INTERNAL_SERVER_ERROR;
//
//     const message =
//       exception instanceof BadRequestException
//         ? (exception.getResponse() as any)?.message || 'Bad request'
//         : exception.message || 'Internal server error';
//
//     const responseBody = {
//       statusCode: httpStatus,
//       messages: Array.isArray(message) ? message : [message],
//       timestamp: new Date().toISOString(),
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//       path: httpAdapter.getRequestUrl(ctx.getRequest()),
//     };
//
//     httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
//   }
// }

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    console.error('🔥 GLOBAL EXCEPTION:', exception);
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let messages: string[] = ['Internal server error'];

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'string') {
        messages = [response];
      } else if (
        typeof response === 'object' &&
        response !== null &&
        'message' in response
      ) {
        const msg = (response as { message: string | string[] }).message;
        messages = Array.isArray(msg) ? msg : [msg];
      }
    }

    const responseBody = {
      statusCode: httpStatus,
      messages,
      timestamp: new Date().toISOString(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
