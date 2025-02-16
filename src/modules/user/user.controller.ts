import { Controller, Get } from '@nestjs/common';

@Controller('/api/user')
export class UserController {

    @Get('/profile')
    getProfile() {
        return 'Hello User, You are Authorized'
    }
}
