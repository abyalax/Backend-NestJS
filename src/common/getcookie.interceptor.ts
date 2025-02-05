import { JwtService } from '@nestjs/jwt';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface RequestWithToken extends Request {
    access_token?: string;
}

@Injectable()
export class GetCookieInterceptor implements NestInterceptor {
    constructor(private jwtService: JwtService) { }
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<RequestWithToken>();

        const access_token: unknown = request.cookies?.access_token;
        console.log('dari cookie interceptors', access_token);
        console.log(typeof access_token);
        if (access_token === '') {
            throw new UnauthorizedException('Access token tidak ditemukan di cookie');
        }
        if (typeof access_token !== 'string') {
            throw new UnauthorizedException('Type access token invalid');
        }
        const checkToken: unknown = this.jwtService.decode(access_token)
        if (checkToken) {
            request.access_token = access_token;

            return next.handle().pipe(
                map((data: unknown) => data),
            );
        } else {
            throw new UnauthorizedException('Access token invalid');
        }

    }
}
