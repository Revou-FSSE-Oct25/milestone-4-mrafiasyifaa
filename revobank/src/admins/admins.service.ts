import { Injectable, NotFoundException } from '@nestjs/common';
import { successResponse } from 'src/common/response.helper';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminsService {
    constructor(
        private readonly prisma: PrismaService
    ){}

    async findAllUsers(page: number = 1, limit: number = 10){
        const [users, total] = await this.prisma.db.$transaction([
            this.prisma.db.user.findMany({
                select:{
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    accounts: true,
                },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.db.user.count(),
        ])
        return successResponse({ users, total, page, limit, totalPages: Math.ceil(total / limit) }, 'User list found successfully!')
    }


    async findOneUser(userId: string){
        const user = await this.prisma.db.user.findUnique({
            where: {id: userId},
            select:{
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                accounts: true,
            }
        })
        if(!user){throw new NotFoundException('User not found!')}
        return successResponse(user, 'User found successfully!')
    }

    async findAllTransactions(page: number = 1, limit: number = 10){
        const [transactions, total] = await this.prisma.db.$transaction([
            this.prisma.db.transaction.findMany({
                orderBy: {createdAt: 'desc'},
                skip: (page - 1) * limit,
                take: limit,
            }),
        this.prisma.db.transaction.count(),
    ])
    return successResponse({ transactions: transactions, total, page, limit, totalPages: Math.ceil(total / limit) }, 'Transaction list found successfully!')
    }
    
    async findOneTransaction(transactionId: string){
        const trx = await this.prisma.db.transaction.findUnique({
            where: {id: transactionId}
        })

        if(!trx){throw new NotFoundException('Transaction not found!')}
        return successResponse(trx, 'Transaction found successfully!')
    }
}
