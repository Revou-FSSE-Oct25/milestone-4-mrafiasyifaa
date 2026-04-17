import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { AdminsService } from './admins.service';

@Controller('admins')
@UseGuards(JwtGuard, new RoleGuard('ADMIN'))
export class AdminsController {
    constructor(
        private readonly adminsService: AdminsService
    ){}

    @Get('users')
    findAllUsers(){
        return this.adminsService.findAllUsers()
    }

    @Get('users/:id')
    findOneUser(@Param('id') userId: string){
        return this.adminsService.findOneUser(userId)
    }

    @Get('transactions')
    findAllTransactions(){
        return this.adminsService.findAllTransactions()
    }

    @Get('transactions/:id')
    findOneTransaction(@Param('id')transactionId: string){
        return this.adminsService.findOneTransaction(transactionId)
    }
}
