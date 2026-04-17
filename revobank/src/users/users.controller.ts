import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";


@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtGuard)
export class UsersController{
    constructor(
        private readonly usersService: UsersService
    ){}

    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, schema: { example: { statusCode: 200, message: 'User found successfully!', data: { id: 'uuid', name: 'John Doe', email: 'john@example.com', role: 'CUSTOMER', createdAt: '2026-01-01T00:00:00.000Z' } } } })
    @ApiResponse({ status: 401, schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } } })
    @Get('profile')
    findOne(@Req() req: Request){
        const userId = req['user'].sub
        return this.usersService.findOne(userId)
    }

    @ApiOperation({ summary: 'Update current user profile' })
    @ApiResponse({ status: 200, schema: { example: { statusCode: 200, message: 'User updated successfully!', data: { id: 'uuid', name: 'Jane Doe', email: 'john@example.com', role: 'CUSTOMER', updatedAt: '2026-01-01T00:00:00.000Z' } } } })
    @ApiResponse({ status: 400, schema: { example: { statusCode: 400, message: ['name should not be empty'], error: 'Bad Request' } } })
    @ApiResponse({ status: 401, schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } } })
    @Patch('profile')
    update(@Req() req: Request, @Body() body: UpdateUserDto){
        const userId = req['user'].sub
        return this.usersService.update(userId, body)
    }

}