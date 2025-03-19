import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BoardsService {

  constructor(private prisma: PrismaService) {}

  create(createBoardDto: CreateBoardDto) {
    return 'This action adds a new board';
  }

  async findAll(userId: string) {

    const boards = await this.prisma.board.findMany({
      where: { createdBy: userId }
    })

    if (!boards.length) {
      throw new NotFoundException('No tienes pizarras creadas')
    }
    
    return boards
  }

  async findOne(userId: string, id: string) {
    const board = await this.prisma.board.findFirst({
      where: { id, createdBy: userId }
    })

    if (!board) {
      throw new NotFoundException('Pizarra no encontrada')
    }

    return board
  }

  update(id: number, updateBoardDto: UpdateBoardDto) {
    return `This action updates a #${id} board`;
  }

  remove(id: number) {
    return `This action removes a #${id} board`;
  }
}
