import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { successResponse } from '../common/response.helper';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async findOne(id: string){
        const user = await this.prisma.db.user.findUnique({
            where: { id },
        })

        if (!user){
            throw new NotFoundException('User not found!')
        }

        const { password, ...result } = user
        return successResponse(result, 'User found successfully!')
    }

    async update(id: string, data: UpdateUserDto){
        await this.findOne(id)

        const updated = await this.prisma.db.user.update({
            where: {id},
            data,
        })

        const { password, ...result } = updated
        return successResponse(result, 'User updated successfully!')
    }

}
