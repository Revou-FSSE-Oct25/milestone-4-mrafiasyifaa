import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { AdminsService } from './admins.service';

@ApiTags('Admins')
@ApiBearerAuth()
@Controller('admins')
@UseGuards(JwtGuard, new RoleGuard('ADMIN'))
export class AdminsController {
    constructor(
        private readonly adminsService: AdminsService
    ){}

    @ApiOperation({ summary: 'Get all users (admin only)' })
    @ApiResponse({ status: 200, schema: { example: { statusCode: 200, message: 'User list found successfully!', data: [{ id: 'uuid', name: 'John Doe', email: 'john@example.com', role: 'CUSTOMER', accounts: [] }] } } })
    @ApiResponse({ status: 401, schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } } })
    @ApiResponse({ status: 403, schema: { example: { statusCode: 403, message: 'Access denied!', error: 'Forbidden' } } })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @Get('users')
    findAllUsers(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ){
        return this.adminsService.findAllUsers(+page, +limit)
    }

    @ApiOperation({ summary: 'Get one user by ID (admin only)' })
    @ApiResponse({ status: 200, schema: { example: { statusCode: 200, message: 'User found successfully!', data: { id: 'uuid', name: 'John Doe', email: 'john@example.com', role: 'CUSTOMER', accounts: [] } } } })
    @ApiResponse({ status: 401, schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } } })
    @ApiResponse({ status: 403, schema: { example: { statusCode: 403, message: 'Access denied!', error: 'Forbidden' } } })
    @ApiResponse({ status: 404, schema: { example: { statusCode: 404, message: 'User not found!', error: 'Not Found' } } })
    @Get('users/:id')

    findOneUser(@Param('id') userId: string){
        return this.adminsService.findOneUser(userId)
    }

    @ApiOperation({ summary: 'Get all transactions (admin only)' })
    @ApiResponse({ status: 200, schema: { example: { statusCode: 200, message: 'Transaction list found successfully!', data: [{ id: 'uuid', type: 'TRANSFER', amount: '100000', createdAt: '2026-01-01T00:00:00.000Z' }] } } })
    @ApiResponse({ status: 401, schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } } })
    @ApiResponse({ status: 403, schema: { example: { statusCode: 403, message: 'Access denied!', error: 'Forbidden' } } })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @Get('transactions')
    findAllTransactions(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ){
        return this.adminsService.findAllTransactions(+page, +limit)
    }

    @ApiOperation({ summary: 'Get one transaction by ID (admin only)' })
    @ApiResponse({ status: 200, schema: { example: { statusCode: 200, message: 'Transaction found successfully!', data: { id: 'uuid', type: 'TRANSFER', amount: '100000', senderAccountId: 'uuid', receiverAccountId: 'uuid', createdAt: '2026-01-01T00:00:00.000Z' } } } })
    @ApiResponse({ status: 401, schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } } })
    @ApiResponse({ status: 403, schema: { example: { statusCode: 403, message: 'Access denied!', error: 'Forbidden' } } })
    @ApiResponse({ status: 404, schema: { example: { statusCode: 404, message: 'Transaction not found!', error: 'Not Found' } } })
    @Get('transactions/:id')
    
    findOneTransaction(@Param('id')transactionId: string){
        return this.adminsService.findOneTransaction(transactionId)
    }
}
