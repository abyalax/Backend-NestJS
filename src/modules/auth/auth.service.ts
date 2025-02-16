import { BadRequestException, ConflictException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LoginInterface, RegisterInterface, UserInterface } from './auth.interface';
import { ResponseAPI } from '../../common/response/response';
import * as bcrypt from 'bcrypt'
import { Logger as WinstonLogger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: WinstonLogger
    ) { }

    async login(user: LoginInterface, res: Response): Promise<void> {
        const findUser = await this.prismaService.user.findFirst({ where: { email: user.email } })
        if (!findUser) throw new UnauthorizedException('User not found')
        const comparePassword = await bcrypt.compare(user.password, findUser.password)
        if (comparePassword) {
            this.logger.info(`\nUser Login Success: ${user.email}`)
            const access_token: string = this.jwtService.sign({ id: findUser.id }, {
                secret: process.env.JWT_SECRET,
                expiresIn: '24h'
            })
            res.cookie('access_token', access_token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
            });
            res.status(HttpStatus.OK).json(new ResponseAPI(HttpStatus.ACCEPTED, 'Success Login', {
                name: findUser.name,
                email: findUser.email,
                role: findUser.role
            }));
        } else {
            this.logger.warn(`\nUser Login Failed: ${user.email}`)
            throw new UnauthorizedException('Password not match')
        }
    }

    async register(user: RegisterInterface): Promise<ResponseAPI<UserInterface | undefined>> {
        const findUser = await this.prismaService.user.findFirst({ where: { email: user.email } })
        if (findUser) throw new ConflictException('Email Already Exist')
        const hashPassword = await bcrypt.hash(user.password, 10)
        user.password = hashPassword
        const response = await this.prismaService.user.create({ data: user })
        if (response !== null) {
            return new ResponseAPI(HttpStatus.CREATED, 'Success Register User', {
                name: response.name,
                email: response.email,
                role: response.role
            })
        } else {
            throw new BadRequestException('Failed Register User')
        }
    }



}
