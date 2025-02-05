import { Controller, Get, Query, Header, HttpCode, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('/api/user')
export class UserController {

  @Get('/set-cookie')
  @Header('Set-Cookie', 'foo=bar; HttpOnly')
  setCookie(@Query('name') name: string, @Res() res: Response) {
    res.cookie('name', name);
    return res.status(200).send('Set Cookie');
  }

  @Get('/get-cookie')
  getCookie(@Req() req: Request): string {
    return `${req.cookies['name']}`;
  }

  @Get('/')
  @Header('Content-Type', 'application/json')
  @HttpCode(200)
  getResponse(): string {
    return 'Ini Data response'
  }
}
