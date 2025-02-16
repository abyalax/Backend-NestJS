import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ZodError } from 'zod';
import { Request, Response } from 'express'

@Catch(ZodError)
export class ValidationFilter implements ExceptionFilter<ZodError> {
  catch(exception: ZodError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.errors.length > 0 ? 400 : 422;
    const message = exception.errors.map((error) => error.message);

    response.status(status).json({
      statusCode: status,
      message: message,
      error: exception.errors,
      path: request.url,
      timestamp: new Date().toISOString()
    });
  }
}
