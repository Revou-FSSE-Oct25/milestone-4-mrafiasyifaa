import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transactions.dto';
import { TransactionType } from '../../generated/prisma/enums';
import { successResponse } from '../common/response.helper';
import { Prisma} from '../../generated/prisma/client'

@Injectable()
export class TransactionsService {
    constructor(
        private readonly prisma: PrismaService
    ){}

    async create(userId: string, dto: CreateTransactionDto){
        const amount = new Prisma.Decimal(dto.amount)

        switch(dto.type){
            case TransactionType.TRANSFER:
                return this.transfer(
                    userId,
                    dto.senderAccountId, 
                    dto.receiverAccountId,
                    amount,
                    dto.description)
            case TransactionType.PURCHASE:
                return this.purchase(
                    userId,
                    dto.senderAccountId,
                    amount,
                    dto.description)
            case TransactionType.DEPOSIT:
                return this.deposit(
                    dto.receiverAccountId,
                    amount,
                    dto.description
                )
            case TransactionType.WITHDRAWAL:
                return this.withdrawal(
                    userId,
                    dto.senderAccountId,
                    amount,
                    dto.description
                )
            default:
                throw new BadRequestException('Invalid transaction type!')
        }
    }

    async findAll(
        userId: string,
        accountId: string
    ){
        if(!accountId){throw new BadRequestException('Account ID query params is required!')}
        const account = await this.prisma.db.account.findUnique({
            where:{id: accountId}
        })

        if(!account){throw new NotFoundException('Account not found!')}
        if(account.userId !== userId){throw new ForbiddenException('Access denied!')}

        const transaction = await this.prisma.db.transaction.findMany({
            where:{
                OR:[{senderAccountId: accountId},
                    {receiverAccountId: accountId}
                ]
            },
            orderBy: {createdAt: 'desc'}
        })
        
        return successResponse(transaction, 'Transactions found!')
    }

    async findOne(userId: string, transactionId: string){
        const trx = await this.prisma.db.transaction.findUnique({
            where: {id: transactionId}
        })

        if(!trx){throw new NotFoundException('Transaction not found!')}

        const relatedAccountIds = [trx.senderAccountId, trx.receiverAccountId].filter(Boolean)
        const ownedAccount = await this.prisma.db.account.findFirst({
            where:{
                id:{in: relatedAccountIds as string[]},
                userId,
            }
        })

        if (!ownedAccount){throw new ForbiddenException('Access denied!')}

        return successResponse(trx, 'Transaction found!')
    }

    async transfer(
        userId: string,
        senderAccountId: string | undefined,
        receiverAccountId: string | undefined,
        amount: Prisma.Decimal,
        description?: string
    ){
        if(!senderAccountId){throw new BadRequestException('senderAccountID is required for TRANSFER!')}
        if(!receiverAccountId){throw new BadRequestException('receiverAccountID is required for TRANSFER!')}

        const sender = await this.prisma.db.account.findUnique({
            where:{
                id: senderAccountId
            }
        })

        if(!sender){throw new NotFoundException('Sender account not found!')}
        if(sender.userId !== userId){throw new ForbiddenException('Access denied!')}
        if(new Prisma.Decimal(sender.balance).lt(amount)){throw new BadRequestException('Insufficient balance!')}
        
        const receiver = await this.prisma.db.account.findUnique({
            where:{
                id: receiverAccountId,
            }
        })

        if(!receiver){throw new NotFoundException('Receiver account not found!')}

        const trx = await this.prisma.db.$transaction(async(tx)=>{
            await tx.account.update({
                where:{id: senderAccountId},
                data:{balance:{decrement: amount}},
            })

            await tx.account.update({
                where: {id: receiverAccountId},
                data: {balance:{increment: amount}}
            })

            return tx.transaction.create({
                data:{
                    senderAccountId,
                    receiverAccountId,
                    amount,
                    type: 'TRANSFER',
                    description
                }
            })

        })

        return successResponse(trx, 'Transfer success!')
    }

    async purchase(
        userId: string,
        senderAccountId: string | undefined,
        amount: Prisma.Decimal,
        description?: string
    ){
        if(!senderAccountId){throw new BadRequestException('senderAccountID is required for PURCHASE!')}
        
        const sender = await this.prisma.db.account.findUnique({
            where:{
                id: senderAccountId
            }
        })
        if(!sender){throw new NotFoundException('Sender account not found!')}
        if(sender.userId !== userId){throw new ForbiddenException('Access denied!')}
        if(new Prisma.Decimal(sender.balance).lt(amount)){throw new BadRequestException('Insufficient balance!')}

        const trx = await this.prisma.db.$transaction(async (tx)=>{
            await tx.account.update({
                where:{id: senderAccountId},
                data:{balance:{decrement: amount}},
            })

            return tx.transaction.create({
                data:{
                    senderAccountId,
                    amount,
                    type: 'PURCHASE',
                    description
                }
            })
        })

        return successResponse(trx, 'Purchase successful!')
    }

    async deposit(
        receiverAccountId: string | undefined,
        amount: Prisma.Decimal, 
        description?: string
    ) {
        if (!receiverAccountId) throw new BadRequestException('receiverAccountId is required for DEPOSIT!');

        const receiver = await this.prisma.db.account.findUnique({ where: { id: receiverAccountId } });
        if (!receiver) throw new NotFoundException('Receiver account not found!');

        const trx = await this.prisma.db.$transaction(async (tx) => {
            await tx.account.update({
                where: { id: receiverAccountId },
                data: { balance: { increment: amount } },
            });

            return tx.transaction.create({
                data: { receiverAccountId, amount, type: 'DEPOSIT', description },
            });
        });

        return successResponse(trx, 'Deposit successful!');
    }

    async withdrawal(
        userId: string,
        senderAccountId: string | undefined,
        amount: Prisma.Decimal,
        description?: string
    ){
        if (!senderAccountId) throw new BadRequestException('senderAccountId is required for WITHDRAWAL!');
        
        const sender = await this.prisma.db.account.findUnique({ where: { id: senderAccountId } });
        if (!sender) throw new NotFoundException('Sender account not found!');
        if (sender.userId !== userId) throw new ForbiddenException('Access denied!');
        if (new Prisma.Decimal(sender.balance).lt(amount)) throw new BadRequestException('Insufficient balance!');

        const trx = await this.prisma.db.$transaction(async(tx)=>{
            await tx.account.update({
                where: {id: senderAccountId},
                data: {balance: {decrement: amount}}
            })

            return tx.transaction.create({
                data:{
                    senderAccountId,
                    amount,
                    type: 'WITHDRAWAL',
                    description
                }
            })
        })
        return successResponse(trx, 'Withdrawal successful!')
    }
}
