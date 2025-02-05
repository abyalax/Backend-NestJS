import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseAPI } from './response-api.dto';

@Injectable()
export class SetCookieInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseAPI<string>> {
        const ctx = context.switchToHttp();
        const response: Response = ctx.getResponse<Response>();

        return next.handle().pipe(
            map((data: string) => {
                if (data) {
                    response.cookie('access_token', data, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 24 * 60 * 60 * 1000,
                    });
                }
                return new ResponseAPI(HttpStatus.OK, 'Login berhasil', data);
            }),
        );
    }
}
