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
// import { LoggerService } from '../../modules/logger/logger.service';
//
// @Catch()
// export class GlobalExceptionFilter implements ExceptionFilter {
//   constructor(private readonly logger: LoggerService) {}
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
//     // ⚡️ Логуємо в консоль або Sentry
//     this.logger.error(exception);
//     // Sentry.captureException(exception);
//
//     response.status(status).json({
//       statusCode: status,
//       messages: Array.isArray(message) ? message : [message],
//       timestamp: new Date().toISOString(),
//       path: request.url,
//     });
//   }
// }
