import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston'
import { LogMiddleware } from './common/log/log.middleware';
import { ValidationModule } from './common/validation/validation.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthMiddleware } from './common/auth/auth.middleware';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from './common/role/role.guard';

@Module({
  imports: [
    WinstonModule.forRoot({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const formattedMessage = typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
          const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
          return `${timestamp as string} [${level}]: ${formattedMessage as string} ${metaString}`;
        })
      ),
      transports: [new winston.transports.Console({
        level: 'debug',
        consoleWarnLevels: ['warn', 'error', 'info', 'debug']
      })],
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
      signOptions: { expiresIn: '24h' },
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    ValidationModule.forRoot(true),
  ],
  controllers: [AppController],
  providers: [AppService, JwtService, {
    provide: APP_GUARD,
    useClass: RoleGuard
  }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes({
      method: RequestMethod.ALL,
      path: '/api/*path'
    })
    consumer.apply(AuthMiddleware).forRoutes({
      method: RequestMethod.ALL,
      path: '/api/user/*path'
    })
  }
}
