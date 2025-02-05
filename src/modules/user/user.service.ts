import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDTO } from '../auth/auth.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {
        console.log('Create UserRepository constructor');
    }

    async create(user: RegisterDTO): Promise<User> {
        try {
            return await this.prismaService.user.create({ data: user });
        } catch (error) {
            throw new Error(`Error create: ${error}`);
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            return await this.prismaService.user.findFirst({
                where: { email },
            });
        } catch (error) {
            throw new Error(`Error findByEmail: ${error}`);
        }
    }

    async findByID( id: number ): Promise<User | null> {
        try {
            const response = await this.prismaService.user.findUnique({ where: { id } });
            return response
        } catch (error) {
            throw new Error(`Error findByID: ${error}`);
        }
    } 

    async update(user: Partial<User>): Promise<User> {
        try {
            const { id, name, email, password } = user;
            const dataToUpdate: Partial<User> = {};
            if (name !== undefined && name !== null) dataToUpdate.name = name;
            if (email !== undefined && email !== null) dataToUpdate.email = email;
            if (password !== undefined && password !== null) dataToUpdate.password = password;
            if (Object.keys(dataToUpdate).length === 0) {
                throw new Error('No valid fields to update');
            }
            const result = await this.prismaService.user.update({
                where: { id },
                data: dataToUpdate,
            });
            return result;
        } catch (error) {
            throw new Error(`Error update: ${error}`);
        }
    }

    async delete(id: number): Promise<User> {
        try {
            return await this.prismaService.user.delete({ where: { id } });
        } catch (error) {
            throw new Error(`Error delete: ${error}`);
        }
    }
}
