import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}

    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, schema: { example: { statusCode: 201, message: 'User registered successfully!', data: { id: 'uuid', name: 'John Doe', email: 'john@example.com', createdAt: '2026-01-01T00:00:00.000Z' } } } })
    @ApiResponse({ status: 400, schema: { example: { statusCode: 400, message: ['name should not be empty'], error: 'Bad Request' } } })
    @ApiResponse({ status: 409, schema: { example: { statusCode: 409, message: 'Email already registered!', error: 'Conflict' } } })
    @Post('register')
    register(@Body() dto: RegisterDto){
        return this.authService.register(dto)
    }

    @ApiOperation({ summary: 'Login and get access token' })
    @ApiResponse({ status: 200, schema: { example: { statusCode: 200, message: 'Login successful!', data: { accessToken: 'eyJhbGci...' } } } })
    @ApiResponse({ status: 400, schema: { example: { statusCode: 400, message: ['email must be an email'], error: 'Bad Request' } } })
    @ApiResponse({ status: 401, schema: { example: { statusCode: 401, message: 'Invalid credentials!', error: 'Unauthorized' } } })
    @Post('login')
    login(@Body() dto: LoginDto){
        return this.authService.login(dto)
    }
}
