import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from 'express';

@Injectable()
export class JwtGuard implements CanActivate{
    constructor(
        private readonly jwt: JwtService
    ){}

    canActivate(ctx: ExecutionContext): boolean{
        const request = ctx.switchToHttp().getRequest<Request>()
        const authHeader = request.headers.authorization

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            throw new UnauthorizedException('Missing or Invalid token!')

        }

        const token = authHeader.split(' ')[1]

        try {
            const payload = this.jwt.verify(token)
            request['user'] = payload
            return true
        } catch (error) {
            throw new UnauthorizedException('Invalid or Expired token!')
        }
    }
}