import { Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/')
  testing(@Res() res: Response): void {
    res.send('Hello World!');
  }

  @Get('/view/login')
  viewLogin(@Res() res: Response): void {
    res.render('login');
  }

  @Get('/view/register')
  viewRegister(@Res() res: Response): void {
    res.render('register');
  }
  
  @Get('/view/hello')
  viewHello(@Query('name') name: string, @Res() res: Response): void {
    res.render('hello', {
      name, title: 'NestJS Hello'
    });
  }

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/post')
  postHello(): string {
    return 'Post';
  }
}
