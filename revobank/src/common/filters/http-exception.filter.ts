import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus
} from '@nestjs/common'
import { Response } from 'express'
import { ApiResponse } from "../interfaces/api-response.interface"

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost){
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        
        const status = 
        exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

        const message = 
        exception instanceof HttpException
        ? (exception.getResponse() as any).message ?? exception.message
        : 'Internal Server Error'

        const body: ApiResponse<null> = {
            statusCode: status,
            message: Array.isArray(message) ? message[0] : message,
            data: null,
        }

        response.status(status).json(body)
    }
}