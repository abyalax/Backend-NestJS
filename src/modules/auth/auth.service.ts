import { Injectable, HttpStatus, BadRequestException, HttpException } from '@nestjs/common';
import { UserService } from './../user/user.service';
import { ResponseAPI } from '../../common/response-api.dto'
import { RegisterDTO, LoginDTO } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserDTO } from '../user/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) { }

    async Register(user: RegisterDTO): Promise<ResponseAPI<UserDTO>> {
        const { email, password } = user;

        const existingUser = await this.userService.findByEmail(email);
        if (existingUser) throw new BadRequestException('Email sudah terdaftar');

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { ...user, password: hashedPassword };

        const createUser = await this.userService.create(newUser);

        if (!createUser) throw new BadRequestException('Gagal membuat pengguna');

        return new ResponseAPI(HttpStatus.CREATED, 'Pengguna berhasil dibuat', createUser);
    }

    async Login(user: LoginDTO, res: Response): Promise<void> {
        const { email, password } = user;
        if (!process.env.JWT_SECRET) {
            throw new HttpException('JWT_SECRET is not set', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const findUser = await this.userService.findByEmail(email);
        if (!findUser) throw new HttpException('Email tidak ditemukan', HttpStatus.NOT_FOUND);

        const isPasswordValid = await bcrypt.compare(password, findUser.password);
        if (!isPasswordValid) throw new HttpException('Password salah', HttpStatus.UNAUTHORIZED);

        const payload = { id: findUser.id, name: findUser.name, email: findUser.email };
        const access_token: string = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '24h'
        });
        res.cookie('access_token', access_token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        const data = {
            name: findUser.name,
            email: findUser.email
        }
        res.status(HttpStatus.OK).json(new ResponseAPI(HttpStatus.OK, 'Login berhasil', data));
    }

    async GetProfile(id: number) {
        try {
            const findUser = await this.userService.findByID(id);
            if (findUser) {
                return new ResponseAPI(HttpStatus.OK, 'User found', findUser)
            } else {
                return new ResponseAPI(HttpStatus.NOT_FOUND, 'User not found', null)
            }
        } catch (error) {
            console.log(error);
            return new ResponseAPI(HttpStatus.NOT_FOUND, 'User not found', null)
        }

    }

    async Logout(res: Response): Promise<ResponseAPI<null>> {
        try {
            res.clearCookie('access_token', { httpOnly: true });
            res.redirect('/view/login');
            return await new Promise<ResponseAPI<null>>(() => ({
                statusCode: HttpStatus.OK,
                message: 'Logout berhasil',
                data: null
            }))
        } catch (error) {
            console.error(error);
            throw new HttpException('Gagal logout', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
