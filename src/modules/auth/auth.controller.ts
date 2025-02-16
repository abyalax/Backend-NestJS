import { Body, Controller, Post, UseInterceptors, Res, UseFilters, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInterface, RegisterInterface } from './auth.interface';
import { ResponseInterceptor } from '../../common/response/response.interceptor';
import { Response } from 'express';
import { ValidationPipe } from '../../common/validation/validation.pipe';
import { loginUserRequestValidation } from '../../models/login.model';
import { ValidationFilter } from '../../common/validation/validation.filter';
import { Roles } from '../../common/role/role.decorator';

@Controller('/api/auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/register')
    register(@Body() user: RegisterInterface) {
        return this.authService.register(user)
    }

    @Post('/login')
    @UseInterceptors(ResponseInterceptor)
    @UseFilters(ValidationFilter)
    login(@Body(new ValidationPipe(loginUserRequestValidation)) user: LoginInterface, @Res() res: Response) {
        return this.authService.login(user, res)
    }

    @Get('/hello')
    @Roles(['admin'])
    hello() {
        return { message: 'Hello User, You are Authorized' }
    }
}
