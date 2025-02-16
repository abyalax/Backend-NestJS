import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

declare module 'express' {
  interface Request {
    cookies: {
      [key: string]: string;
    };
  }
}

interface JwtPayload {
  id: number;
  iat: number;
  exp: number;
}

interface RequestWithUser extends Request {
  user: User;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}

  async use(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.cookies || !req.cookies['access_token']) {
        throw new UnauthorizedException('Access token is required');
      }
      const accessToken: string | undefined = req.cookies['access_token'];
      
      if (!accessToken) {
        throw new UnauthorizedException('Access token is required');
      }

      const verified = await this.jwtService.verifyAsync<JwtPayload>(
        accessToken,
        {
          secret: process.env.JWT_SECRET,
          maxAge: '24h'
        }
      );

      if (verified) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const decoded = this.jwtService.decode(accessToken)
        if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
          throw new UnauthorizedException('Invalid token payload');
        }
        const user = await this.prismaService.user.findUnique({
          where: { id: (decoded as JwtPayload).id },
        });

        if (!user) {
          throw new UnauthorizedException('User not found');
        }

        console.log('User from auth middleware', user);
        req.user = user;
        next();
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    } catch (error) {
      throw new UnauthorizedException('Unauthorized ' + error);
    }
  }
}