import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import type { Request } from 'express';

@Controller('accounts')
@UseGuards(JwtGuard)
export class AccountsController {
    constructor(
        private readonly accountsService: AccountsService
    ){}

    @Post()
    create(@Req() req: Request, @Body() dto: CreateAccountDto){
        const userId = req['user'].sub
        return this.accountsService.create(userId, dto)
    }

    @Get()
    findAll(@Req()req: Request){
        const userId = req['user'].sub
        return this.accountsService.findAll(userId)
    }

    @Get(':id')
    findOne(@Req() req: Request, @Param('id') accountId: string){
        const userId = req['user'].sub
        return this.accountsService.findOne(userId, accountId)
    }

    @Delete(':id')
    remove(@Req() req: Request, @Param('id') accountId: string){
        const userId = req['user'].sub
        return this.accountsService.remove(userId, accountId)
    }
}
