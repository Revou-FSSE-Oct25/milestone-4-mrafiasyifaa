import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @Get(':id')
    findOne(@Param('id')id: string){
        return this.usersService.findOne(id)
    }

    @Patch(':id')
    update(@Param('id')id: string, @Body() body: Partial<{name: string}>){
        return this.usersService.update(id, body)
    }
    
}
