import { Controller, Get, Post, Query, Res, Req, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import { resolve } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('view')
  @Render(resolve(__dirname, '..', '..', 'views', 'index.html'))
  indexView() { }

  @Get('view/login')
  @Render(resolve(__dirname, '..', '..', 'views', 'login.html'))
  loginView() { }

  @Get('view/register')
  @Render(resolve(__dirname, '..', '..', 'views', 'register.html'))
  registerView() { }

  @Get('hello')
  viewHello(@Query('name') name: string, @Res() res: Response) {
    res.render('hello', { name });
  }

  @Get('set-cookie')
  setCookie(@Query('name') name: string, @Res() res: Response) {
    res.cookie('name', name);
    return res.status(200).send('Set Cookie');
  }

  @Get('get-cookie')
  getCookie(@Req() req: Request): string {
    const cookie = req.cookies['name'] as string;
    return `
      <h1>${cookie}</h1>
    `
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  postHello(): string {
    return 'Post';
  }
}
