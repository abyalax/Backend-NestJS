import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super();
        console.info('Create PrismaService constructor');
    }
    async onModuleInit() {
        console.log('Connect PrismaService onModuleInit');
        await this.$connect()
    }
    async onModuleDestroy() {
        console.log('Disconnect PrismaService onModuleDestroy');
        await this.$disconnect()
    }
}