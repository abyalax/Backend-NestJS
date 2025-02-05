import { IsNotEmpty, IsEmail, IsString, MinLength } from 'class-validator'
export class LoginDTO {
    @IsNotEmpty()
    @IsEmail({}, { message: 'Please enter correct email' })
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string

    access_token?: string;
}

export class RegisterDTO {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Please enter correct email' })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string;
}