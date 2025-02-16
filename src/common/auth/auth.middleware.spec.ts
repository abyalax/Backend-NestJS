import { JwtService } from '@nestjs/jwt';
import { AuthMiddleware } from './auth.middleware';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthMiddleware', () => {
  it('should be defined', () => {
    expect(new AuthMiddleware(new JwtService, new PrismaService)).toBeDefined();
  });
});
