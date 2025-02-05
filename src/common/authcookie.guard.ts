import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();

        const access_token = request.cookies?.access_token as unknown;
        console.log('Dari cookie guard:', access_token);
        console.log('Tipe:', typeof access_token);

        if (!access_token || typeof access_token !== 'string') {
            throw new UnauthorizedException('Access token tidak ditemukan atau invalid');
        }
        const option: JwtVerifyOptions = {
            secret: process.env.JWT_SECRET,
        }
        try {
            const decodedToken = this.jwtService.verify(access_token, option) as unknown
            if (decodedToken) {
                return true
            }
            return false;
        } catch (error) {
            throw new UnauthorizedException('Access token invalid' + error);
        }
    }
}
