import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";


@Controller('users')
@UseGuards(JwtGuard)
export class UsersController{
    constructor(
        private readonly usersService: UsersService
    ){}

    @Get('profile')
    findOne(@Req() req: Request){
        const userId = req['user'].sub
        return this.usersService.findOne(userId)
    }

    @Patch('profile')
    update(@Req() req: Request, @Body() body: UpdateUserDto){
        const userId = req['user'].sub
        return this.usersService.update(userId, body)
    }

}