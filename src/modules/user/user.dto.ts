import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class UserDTO {
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class UserDataDTO {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Please enter correct email' })
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;
}