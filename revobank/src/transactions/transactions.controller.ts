import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transactions.dto';
import type { Request } from 'express';

@Controller('transactions')
@UseGuards(JwtGuard)
export class TransactionsController {
    constructor(
        private readonly transactionService: TransactionsService
    ){}

    @Post()
    create(@Req() req: Request, @Body() dto: CreateTransactionDto){
        const userId = req['user'].sub
        return this.transactionService.create(userId, dto)
    }
    
    @Get()
    findAll(@Req() req: Request, @Query('accountId') accountId: string){
        const userId = req['user'].sub
        return this.transactionService.findAll(userId, accountId)
    }
}
