import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { ProductController } from './modules/product/product.controller';
import { ProductService } from './modules/product/product.service';
import { UserController } from './modules/user/user.controller';
import { UserService } from './modules/user/user.service';
import { AuthService } from './modules/auth/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UserModule,
    PrismaModule,
    AuthModule,
    ProductModule
  ],
  controllers: [AppController, UserController, ProductController],
  providers: [AppService, UserService, AuthService, ProductService],
  exports: [AppService, UserService,AuthService, ProductService]
})
export class AppModule { }
