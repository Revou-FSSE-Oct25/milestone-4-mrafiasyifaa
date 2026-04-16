import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { randomInt } from 'crypto';
import { successResponse } from '../common/response.helper';

@Injectable()
export class AccountsService {
    constructor(
        private readonly prisma: PrismaService
    ){}

    private async generateAccountNumber(): Promise<string>{
        let accountNumber!: string
        let exists = true

        while(exists){
            accountNumber = randomInt(10000000, 99999999).toString()
            exists = !!(await this.prisma.db.account.findUnique({where: {accountNumber}}))
        }

        return accountNumber
    }

    async create(userId: string, dto: CreateAccountDto){
        const accountNumber = await this.generateAccountNumber()

        const account = await this.prisma.db.account.create({
            data: {
                userId,
                accountNumber,
                name: dto.name,
                type: dto.type,
            },
        })

        return successResponse(account, 'Account created successfully!')
    }

    async findAll(userId: string){
        const accounts = await this.prisma.db.account.findMany({
            where:{userId},
        })

        return successResponse(accounts, 'Account found successfully!')
    }

    async findOne(userId: string, accountId: string){
        const account = await this.prisma.db.account.findUnique({
            where: {id: accountId}
        })

        if(!account){
            throw new NotFoundException('Account not found!')
        }
        
        if(account.userId !== userId){
            throw new ForbiddenException("Access denied!")
        }

        return successResponse(account, 'Account retrieved successfully!')
    }

    async update(userId: string, accountId: string, data: Partial<{name: string}>){
        const account = await this.prisma.db.account.findUnique({
            where: {id: accountId}
        })

        if(!account){throw new NotFoundException('Account not found!')}
        if(account.userId !== userId){throw new ForbiddenException('Access denied!')}

        const updated = await this.prisma.db.account.update({
            where: {id: accountId},
            data,
        })

        return successResponse(updated, 'Account updated successfully!')
    }

    async remove(userId: string, accountId:string){
        const account = await this.prisma.db.account.findUnique({
            where:{
                id: accountId
            },
        })

        if(!account){
            throw new NotFoundException('Account not found!')
        }

        if(account.userId !== userId){
            throw new ForbiddenException("Access denied!")
        }

        await this.prisma.db.account.delete({
            where: {id: accountId}
        })

        return successResponse(null, 'Account deleted successfully!')
    }

}
