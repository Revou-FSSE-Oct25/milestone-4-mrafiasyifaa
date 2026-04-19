import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transactions.dto';
import type { Request } from 'express';
import { Prisma } from '../../generated/prisma/client';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
@UseGuards(JwtGuard)
export class TransactionsController {
    constructor(private readonly transactionService: TransactionsService) {}
    
    @ApiOperation({ summary: 'Create a transaction (generic)' })
    @ApiResponse({ status: 201, schema: { example: { statusCode: 201, message: 'Transaction created successfully!', data: { id: 'uuid', type: 'TRANSFER', amount: '50000', createdAt: '2026-01-01T00:00:00.000Z' } } } })
    @ApiResponse({ status: 400, schema: { example: { statusCode: 400, message: 'Insufficient balance!', error: 'Bad Request' } } })
    @ApiResponse({ status: 401, schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } } })
    @ApiResponse({ status: 403, schema: { example: { statusCode: 403, message: 'Access denied!', error: 'Forbidden' } } })
    @Post()
    create(@Req() req: Request, @Body() dto: CreateTransactionDto) {
        const userId = req['user'].sub;
        return this.transactionService.create(userId, dto);
    }

    @ApiOperation({ summary: 'Deposit funds into an account' })
    @ApiResponse({ status: 201, schema: { example: { statusCode: 201, message: 'Transaction created successfully!', data: { id: 'uuid', type: 'DEPOSIT', amount: '100000', receiverAccountId: 'uuid', createdAt: '2026-01-01T00:00:00.000Z' } } } })
    @ApiResponse({ status: 400, schema: { example: { statusCode: 400, message: 'Receiver account not found!', error: 'Bad Request' } } })
    @ApiResponse({ status: 401, schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } } })
    @Post('deposit')
    deposit(@Req() req: Request, @Body() dto: CreateTransactionDto) {
        const userId = req['user'].sub;
        return this.transactionService.deposit(userId, dto.receiverAccountId, new Prisma.Decimal(dto.amount), dto.description);
    }

    @ApiOperation({ summary: 'Withdraw funds from an account' })
    @ApiResponse({ status: 201, schema: { example: { statusCode: 201, message: 'Transaction created successfully!', data: { id: 'uuid', type: 'WITHDRAWAL', amount: '50000', senderAccountId: 'uuid', createdAt: '2026-01-01T00:00:00.000Z' } } } })
    @ApiResponse({ status: 400, schema: { example: { statusCode: 400, message: 'Insufficient balance!', error: 'Bad Request' } } })
    @ApiResponse({ status: 401, schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } } })
    @ApiResponse({ status: 403, schema: { example: { statusCode: 403, message: 'Access denied!', error: 'Forbidden' } } })
    @Post('withdrawal')
    withdrawal(@Req() req: Request, @Body() dto: CreateTransactionDto) {
        const userId = req['user'].sub;
        return this.transactionService.withdrawal(userId, dto.senderAccountId, new Prisma.Decimal(dto.amount), dto.description);
    }

    @ApiOperation({ summary: 'Transfer funds between accounts' })
    @ApiResponse({ status: 201, schema: { example: { statusCode: 201, message: 'Transaction created successfully!', data: { id: 'uuid', type: 'TRANSFER', amount: '100000', senderAccountId: 'uuid', receiverAccountId: 'uuid', createdAt: '2026-01-01T00:00:00.000Z' } } } })
    @ApiResponse({ status: 400, schema: { example: { statusCode: 400, message: 'Insufficient balance!', error: 'Bad Request' } } })
    @ApiResponse({ status: 401, schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } } })
    @ApiResponse({ status: 403, schema: { example: { statusCode: 403, message: 'Access denied!', error: 'Forbidden' } } })
    @Post('transfer')
    transfer(@Req() req: Request, @Body() dto: CreateTransactionDto) {
        const userId = req['user'].sub;
        return this.transactionService.transfer(userId, dto.senderAccountId, dto.receiverAccountId, new Prisma.Decimal(dto.amount), dto.description);
    }

    @ApiOperation({ summary: 'Make a purchase from an account' })
    @ApiResponse({ status: 201, schema: { example: { statusCode: 201, message: 'Transaction created successfully!', data: { id: 'uuid', type: 'PURCHASE', amount: '25000', senderAccountId: 'uuid', description: 'Belanja groceries', createdAt: '2026-01-01T00:00:00.000Z' } } } })
    @ApiResponse({ status: 400, schema: { example: { statusCode: 400, message: 'Insufficient balance!', error: 'Bad Request' } } })
    @ApiResponse({ status: 401, schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } } })
    @ApiResponse({ status: 403, schema: { example: { statusCode: 403, message: 'Access denied!', error: 'Forbidden' } } })
    @Post('purchase')
    purchase(@Req() req: Request, @Body() dto: CreateTransactionDto) {
        const userId = req['user'].sub;
        return this.transactionService.purchase(userId, dto.senderAccountId, new Prisma.Decimal(dto.amount), dto.description);
    }

    @ApiOperation({ summary: 'Get all transactions (optionally filter by accountId)' })
    @ApiQuery({ name: 'accountId', required: false })
    @ApiResponse({ status: 200, schema: { example: { statusCode: 200, message: 'Transactions found successfully!', data: [{ id: 'uuid', type: 'DEPOSIT', amount: '100000', createdAt: '2026-01-01T00:00:00.000Z' }] } } })
    @ApiResponse({ status: 401, schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } } })
    @Get()
    findAll(@Req() req: Request, @Query('accountId') accountId: string) {
        const userId = req['user'].sub;
        return this.transactionService.findAll(userId, accountId);
    }

    @ApiOperation({ summary: 'Get one transaction by ID' })
    @ApiResponse({ status: 200, schema: { example: { statusCode: 200, message: 'Transaction found successfully!', data: { id: 'uuid', type: 'TRANSFER', amount: '100000', senderAccountId: 'uuid', receiverAccountId: 'uuid', createdAt: '2026-01-01T00:00:00.000Z' } } } })
    @ApiResponse({ status: 401, schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } } })
    @ApiResponse({ status: 403, schema: { example: { statusCode: 403, message: 'Access denied!', error: 'Forbidden' } } })
    @ApiResponse({ status: 404, schema: { example: { statusCode: 404, message: 'Transaction not found!', error: 'Not Found' } } })
    @Get(':id')
    findOne(@Req() req: Request, @Param('id') transactionId: string) {
        const userId = req['user'].sub;
        return this.transactionService.findOne(userId, transactionId);
    }
}