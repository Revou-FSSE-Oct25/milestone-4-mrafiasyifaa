import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transactions.dto';
import type { Request } from 'express';
import { Prisma } from '../../generated/prisma/client';

@Controller('transactions')
@UseGuards(JwtGuard)
export class TransactionsController {
    constructor(private readonly transactionService: TransactionsService) {}
    
    @Post()
    create(@Req() req: Request, @Body() dto: CreateTransactionDto) {
        const userId = req['user'].sub;
        return this.transactionService.create(userId, dto);
    }

    @Post('deposit')
    deposit(@Req() req: Request, @Body() dto: CreateTransactionDto) {
        const userId = req['user'].sub;
        return this.transactionService.deposit(dto.receiverAccountId, new Prisma.Decimal(dto.amount), dto.description);
    }

    @Post('withdrawal')
    withdrawal(@Req() req: Request, @Body() dto: CreateTransactionDto) {
        const userId = req['user'].sub;
        return this.transactionService.withdrawal(userId, dto.senderAccountId, new Prisma.Decimal(dto.amount), dto.description);
    }

    @Post('transfer')
    transfer(@Req() req: Request, @Body() dto: CreateTransactionDto) {
        const userId = req['user'].sub;
        return this.transactionService.transfer(userId, dto.senderAccountId, dto.receiverAccountId, new Prisma.Decimal(dto.amount), dto.description);
    }

    @Post('purchase')
    purchase(@Req() req: Request, @Body() dto: CreateTransactionDto) {
        const userId = req['user'].sub;
        return this.transactionService.purchase(userId, dto.senderAccountId, new Prisma.Decimal(dto.amount), dto.description);
    }

    @Get()
    findAll(@Req() req: Request, @Query('accountId') accountId: string) {
        const userId = req['user'].sub;
        return this.transactionService.findAll(userId, accountId);
    }

    @Get(':id')
    findOne(@Req() req: Request, @Param('id') transactionId: string) {
        const userId = req['user'].sub;
        return this.transactionService.findOne(userId, transactionId);
    }
}