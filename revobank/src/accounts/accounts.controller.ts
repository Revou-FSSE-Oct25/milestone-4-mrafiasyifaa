import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import type { Request } from 'express';

@ApiTags('Accounts')
@ApiBearerAuth()
@Controller('accounts')
@UseGuards(JwtGuard)
export class AccountsController {
    constructor(
        private readonly accountsService: AccountsService
    ){}

    @ApiOperation({ summary: 'Create a new account' })
    @ApiResponse({ status: 201, schema: { example: { statusCode: 201, message: 'Account created successfully!', data: { id: 'uuid', accountNumber: '12345678', name: 'My Savings', type: 'SAVINGS', balance: '0', createdAt: '2026-01-01T00:00:00.000Z' } } } })
    @ApiResponse({ status: 400, schema: { example: { statusCode: 400, message: ['type must be one of SAVINGS, CHECKING, BUSINESS, INVESTMENT, LOAN'], error: 'Bad Request' } } })
    @ApiResponse({ status: 401, schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } } })
    @Post()
    create(@Req() req: Request, @Body() dto: CreateAccountDto){
        const userId = req['user'].sub
        return this.accountsService.create(userId, dto)
    }

    @ApiOperation({ summary: 'Get all accounts of current user' })
    @ApiResponse({ status: 200, schema: { example: { statusCode: 200, message: 'Account found successfully!', data: [{ id: 'uuid', accountNumber: '12345678', name: 'My Savings', type: 'SAVINGS', balance: '500000' }] } } })
    @ApiResponse({ status: 401, schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } } })
    @Get()
    findAll(@Req()req: Request){
        const userId = req['user'].sub
        return this.accountsService.findAll(userId)
    }

    @ApiOperation({ summary: 'Get one account by ID' })
    @ApiResponse({ status: 200, schema: { example: { statusCode: 200, message: 'Account retrieved successfully!', data: { id: 'uuid', accountNumber: '12345678', name: 'My Savings', type: 'SAVINGS', balance: '500000' } } } })
    @ApiResponse({ status: 401, schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } } })
    @ApiResponse({ status: 403, schema: { example: { statusCode: 403, message: 'Access denied!', error: 'Forbidden' } } })
    @ApiResponse({ status: 404, schema: { example: { statusCode: 404, message: 'Account not found!', error: 'Not Found' } } })
    @Get(':id')
    findOne(@Req() req: Request, @Param('id') accountId: string){
        const userId = req['user'].sub
        return this.accountsService.findOne(userId, accountId)
    }

    @ApiOperation({ summary: 'Update account name' })
    @ApiResponse({ status: 200, schema: { example: { statusCode: 200, message: 'Account updated successfully!', data: { id: 'uuid', name: 'New Name', type: 'SAVINGS', balance: '500000' } } } })
    @ApiResponse({ status: 401, schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } } })
    @ApiResponse({ status: 403, schema: { example: { statusCode: 403, message: 'Access denied!', error: 'Forbidden' } } })
    @ApiResponse({ status: 404, schema: { example: { statusCode: 404, message: 'Account not found!', error: 'Not Found' } } })
    @Patch(':id')
    update(@Req() req: Request, @Param('id') accountId: string, @Body() body: Partial<{name: string}>){
        const userId = req['user'].sub
        return this.accountsService.update(userId, accountId, body)
    }

    @ApiOperation({ summary: 'Delete an account' })
    @ApiResponse({ status: 200, schema: { example: { statusCode: 200, message: 'Account deleted successfully!', data: null } } })
    @ApiResponse({ status: 401, schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } } })
    @ApiResponse({ status: 403, schema: { example: { statusCode: 403, message: 'Access denied!', error: 'Forbidden' } } })
    @ApiResponse({ status: 404, schema: { example: { statusCode: 404, message: 'Account not found!', error: 'Not Found' } } })
    @Delete(':id')
    remove(@Req() req: Request, @Param('id') accountId: string){
        const userId = req['user'].sub
        return this.accountsService.remove(userId, accountId)
    }
}
