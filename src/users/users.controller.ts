import { Controller, Get, Body, UseGuards, Req, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: Request) {
    return req.user
  }

  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  updateProfile(
    @Req() req: Request & { user: { id: string } },
    @Body() data: UpdateUserDto
  ) {
    return this.usersService.update(req.user.id, data)
  }
}
