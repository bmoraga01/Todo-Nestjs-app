import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body)
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Req() req: Request) {
    return this.authService.login(body, req)
  }

  @Get('verify')
  async verify(@Query('token') token: string) {
    return this.authService.verifyEmail(token)
  }
}
