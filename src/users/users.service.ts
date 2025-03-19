import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {

  constructor( private prisma: PrismaService ) {}

  async update(userId: string, data: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data
    })

    return user
  }
}
