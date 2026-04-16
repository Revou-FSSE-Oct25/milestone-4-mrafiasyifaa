import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { successResponse } from '../common/response.helper';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
    ){}

    async register(dto: RegisterDto){

        const existsUser = await this.prisma.db.user.findUnique({
            where: {email: dto.email},
        })

        if(existsUser){
            throw new ConflictException('Email already registered!')
        }

        const hashed = await bcrypt.hash(dto.password, 10)

        const user = await this.prisma.db.user.create({
            data: {
                ...dto,
                password: hashed
            }
        })

        const { password, ...result} = user

        return successResponse(result, 'User registered succesfully!')
    }

    async login(dto:  LoginDto){
        const user = await this.prisma.db.user.findUnique({
            where:{
                email: dto.email
            },
        })

        if(!user){
            throw new UnauthorizedException('Invalid credentials!')
        }

        const matchUser = await bcrypt.compare(dto.password, user.password)

        if(!matchUser){
            throw new UnauthorizedException('Invalid credentials!')
        }

        const token = this.jwt.sign({
            sub: user.id,
            email: user.email,
        })

        return successResponse({access_token: token}, 'Login successful!')

    }
}
