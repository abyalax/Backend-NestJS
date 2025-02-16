import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

interface Response {
  statusCode: number
  message: string
  data: unknown
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map((data) => {
        const timestamp = new Date().toISOString();
        return {
          ...data as Response,
          meta: {
            timestamp,
            path: request.url
          }
        }
      })
    );
  }
}