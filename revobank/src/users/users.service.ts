import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { successResponse } from '../common/response.helper';

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

        return successResponse(user, 'User found successfully!')
    }

    async update(id: string, data: Partial<{ name: string}>){
        await this.findOne(id)

        const updated = await this.prisma.db.user.update({
            where: {id},
            data,
        })

        return successResponse(updated, 'User updated successfully!')
    }

}
