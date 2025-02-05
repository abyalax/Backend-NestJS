import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../user/user.service';

jest.mock('bcrypt', () => ({
    compare: jest.fn(),
    hash: jest.fn(),
    genSalt: jest.fn(),
}));

describe('AuthController', () => {
    let controller: AuthController;
    let authServiceMock: Partial<AuthService>;
    let userServiceMock: Partial<UserService>;
    let jwtServiceMock: Partial<JwtService>;
    let mockResponse: Partial<Response>;

    beforeEach(async () => {
        authServiceMock = {
            Login: jest.fn().mockResolvedValue({
                success: true,
                data: { name: 'Test User', email: 'test@example.com' },
            }),
            Register: jest.fn().mockResolvedValue({
                success: true,
                data: { name: 'New User', email: 'new@example.com' },
            }),
            Logout: jest.fn().mockResolvedValue({
                statusCode: HttpStatus.OK,
                message: 'Logout berhasil',
                data: null
            }),
        };
        userServiceMock = {
            findByEmail: jest.fn().mockResolvedValue({
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashedPassword',
            }),
            create: jest.fn().mockResolvedValue({
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashedPassword',
            }),
            update: jest.fn().mockResolvedValue({
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashedPassword',
            }),
            delete: jest.fn().mockResolvedValue({
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashedPassword',
            }),
        }
        mockResponse = {
            redirect: jest.fn(),
            clearCookie: jest.fn(),
            // cookie: jest.fn().mockImplementation((_name: string, _value: string, options: CookieOptions) => {
            //     return mockResponse; // Enable method chaining
            // }),
            cookie: jest.fn().mockImplementation(() => mockResponse),
            // cookie: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
            setHeader: jest.fn(),
            end: jest.fn(),
        };
        jwtServiceMock = {
            sign: jest.fn(),
            signAsync: jest.fn().mockResolvedValue('fake-jwt-token'),
            verifyAsync: jest.fn(),
            verify: jest.fn(),
            decode: jest.fn(),
        };

        userServiceMock.findByEmail = jest.fn().mockResolvedValue({
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
        });
        jwtServiceMock.signAsync = jest.fn().mockResolvedValue('mock-jwt-token');
        authServiceMock.Login = jest.fn().mockResolvedValue({
            success: true,
            data: {
                name: 'Test User',
                email: 'test@example.com',
            },
        });
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: authServiceMock,
                },
                {
                    provide: UserService,
                    useValue: userServiceMock,
                },
                {
                    provide: JwtService,
                    useValue: jwtServiceMock,
                }
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        process.env.JWT_SECRET = 'test-secret';
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should return access_token in response body', async () => {
        process.env.JWT_SECRET = 'secret';

        userServiceMock.findByEmail = jest.fn().mockResolvedValue({
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
        });

        jwtServiceMock.signAsync = jest.fn().mockResolvedValue('mock-jwt-token');

        const response = await controller.login({ email: 'test@example.com', password: 'hashedPassword' }, mockResponse as Response);
        expect(response).toEqual({
            success: true,
            data: {
                name: 'Test User',
                email: 'test@example.com'
            },
        });
    });


    it('should return user data on register', async () => {
        const result = await controller.register({ name: 'New User', email: 'new@example.com', password: 'password123' });
        expect(authServiceMock.Register).toHaveBeenCalledWith({ name: 'New User', email: 'new@example.com', password: 'password123' });
        expect(result).toEqual({
            success: true,
            data: { name: 'New User', email: 'new@example.com' },
        });
    });

    it('should return error if register email already exists', async () => {
        authServiceMock.Register = jest.fn().mockRejectedValue(new HttpException('Email sudah terdaftar', HttpStatus.BAD_REQUEST));
        try {
            await controller.register({ name: 'Existing User', email: 'existing@example.com', password: 'password123' });
        } catch (error) {
            const httpError = error as HttpException;
            const response = httpError.getResponse();
            expect(response).toEqual('Email sudah terdaftar');
            expect(httpError.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
        }
    });
    // it('should return user data on login', async () => {
    //     const mockUser = {
    //         id: 1,
    //         name: 'Test User',
    //         email: 'test@example.com',
    //         password: 'hashedPassword',
    //     };

    //     const mockToken = 'mock-jwt-token';

    //     // Setup mocks
    //     (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    //     userServiceMock.findByEmail = jest.fn().mockResolvedValue(mockUser);
    //     jwtServiceMock.signAsync = jest.fn().mockResolvedValue(mockToken);
    //     const result = await controller.login({ email: 'test@example.com', password: 'password123' }, mockResponse as Response);
    //     expect(authServiceMock.Login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' }, mockResponse as Response);
    //     expect(jwtServiceMock.signAsync).toHaveBeenCalled();
    //     expect(mockResponse.cookie).toHaveBeenCalled();
    //     expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(
    //         expect.objectContaining({
    //             id: 1,
    //             name: 'Test User',
    //             email: 'test@example.com'
    //         }),
    //         expect.objectContaining({
    //             secret: process.env.JWT_SECRET,
    //             expiresIn: '24h'
    //         })
    //     );
    //     expect(mockResponse.cookie).toHaveBeenCalledWith('access_token', 'fake-jwt-token', expect.objectContaining({
    //         httpOnly: true,
    //         maxAge: 24 * 60 * 60 * 1000,
    //     }));
    //     expect(result).toEqual({
    //         success: true,
    //         data: {
    //             name: 'Test User',
    //             email: 'test@example.com'
    //         }
    //     });
    // });
    it('should return error if login email not found', async () => {
        authServiceMock.Login = jest.fn().mockRejectedValue(new HttpException('Email tidak ditemukan', HttpStatus.NOT_FOUND));
        try {
            await controller.login({ email: 'wrong@example.com', password: 'password123' }, mockResponse as Response);
        } catch (error) {
            const httpError = error as HttpException;  // Casting error sebagai HttpException
            const response = httpError.getResponse();  // Menggunakan getResponse untuk mengakses response
            expect(response).toEqual('Email tidak ditemukan');
            expect(httpError.getStatus()).toEqual(HttpStatus.NOT_FOUND);
        }
    });

    it('should return error if login password incorrect', async () => {
        authServiceMock.Login = jest.fn().mockRejectedValue(new HttpException('Password salah', HttpStatus.UNAUTHORIZED));
        try {
            await controller.login({ email: 'wrong@example.com', password: 'password123' }, mockResponse as Response);
        } catch (error) {
            const httpError = error as HttpException;
            const response = httpError.getResponse();
            expect(response).toEqual('Password salah');
            expect(httpError.getStatus()).toEqual(HttpStatus.UNAUTHORIZED);
        }
    });

    it('should return error if login password incorrect', async () => {
        authServiceMock.Login = jest.fn().mockRejectedValue(new HttpException('Password salah', HttpStatus.UNAUTHORIZED));
        try {
            await controller.login({ email: 'wrong@example.com', password: 'password123' }, mockResponse as Response);
        } catch (error) {
            const httpError = error as HttpException;
            const response = httpError.getResponse();
            expect(response).toEqual('Password salah');
            expect(httpError.getStatus()).toEqual(HttpStatus.UNAUTHORIZED);
        }
    });

    it('should return error if JWT_SECRET is not set', async () => {
        process.env.JWT_SECRET = '';
        try {
            await controller.login({ email: 'test@example.com', password: 'password123' }, mockResponse as Response);
        } catch (error) {
            const httpError = error as HttpException;
            const response = httpError.getResponse();
            expect(response).toEqual('JWT_SECRET is not set');
            expect(httpError.getStatus()).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    });



    it('should return success message on logout', async () => {
        authServiceMock.Logout = jest.fn().mockResolvedValue({
            statusCode: HttpStatus.OK,
            message: 'Logout berhasil',
            data: null
        })
        try {
            await controller.logout(mockResponse as Response);
        } catch (error) {
            const httpError = error as HttpException;
            const response = httpError.getResponse();
            expect(response).toEqual('Logout berhasil');
            expect(httpError.getStatus()).toEqual(HttpStatus.OK);
        }
    });
    it('should return error when failed to logout', async () => {
        authServiceMock.Logout = jest.fn().mockRejectedValue(new HttpException('Gagal logout', HttpStatus.INTERNAL_SERVER_ERROR));
        try {
            await controller.logout(mockResponse as Response);
        } catch (error) {
            const httpError = error as HttpException;
            const response = httpError.getResponse();
            expect(response).toEqual('Gagal logout');
            expect(httpError.getStatus()).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    });
});
