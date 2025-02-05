import { Body, Controller, HttpStatus, Post, HttpCode, Res, Get, Param, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './auth.dto';
import { UserDTO } from '../user/user.dto';
import { ResponseAPI } from '../../common/response-api.dto';
import { AuthGuard } from '../../common/authcookie.guard';

@Controller('/api')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @HttpCode(HttpStatus.OK)
    @Get('/auth')
    helloWorld(@Res() res: Response) {
        res.status(HttpStatus.OK).send('API Auth is running');
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('/auth/register')
    async register(@Body() user: RegisterDTO): Promise<ResponseAPI<UserDTO>> {
        return await this.authService.Register(user);
    }

    @HttpCode(HttpStatus.OK)
    @Post('/auth/login')
    async login(@Body() user: LoginDTO, @Res() res: Response) {
        return await this.authService.Login(user, res);
    }

    @UseGuards(AuthGuard)
    // @UseInterceptors(GetCookieInterceptor)  //for example
    @HttpCode(HttpStatus.OK)
    @Get('/profile/:id')
    async getProfile(@Param('id') id: string) {
        return await this.authService.GetProfile(parseInt(id));
    }

    @HttpCode(HttpStatus.OK)
    @Post('/auth/logout')
    logout(@Res() res: Response) {
        return this.authService.Logout(res);
    }
}
