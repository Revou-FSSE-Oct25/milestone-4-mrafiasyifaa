import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "generated/prisma/client";


@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy{
    private readonly prisma: PrismaClient
    
    constructor(){
        const adapter = new PrismaPg({
            connectionString: process.env.DATABASE_URL
        })
        this.prisma = new PrismaClient({adapter})
    }

    get db(){
        return this.prisma
    }

    async onModuleInit() {
        await this.prisma.$connect()
    }

    async onModuleDestroy() {
        await this.prisma.$disconnect()
    }

}