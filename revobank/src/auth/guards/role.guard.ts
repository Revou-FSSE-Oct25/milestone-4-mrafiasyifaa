import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";


@Injectable()
export class RoleGuard implements CanActivate{
    constructor(
        private readonly requiredRole: string
    ){}

    canActivate(context: ExecutionContext): boolean{
        const request = context.switchToHttp().getRequest<Request>()
        const user = request['user']

        if(!user || user.role !== this.requiredRole){
            throw new ForbiddenException('Access denied!')
        }

    return true
    }
}