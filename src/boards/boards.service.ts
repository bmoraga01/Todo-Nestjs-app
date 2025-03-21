import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BoardState } from '@prisma/client';

@Injectable()
export class BoardsService {

  constructor(private prisma: PrismaService) {}

  async create(userID: string, createBoardDto: CreateBoardDto) {
    const exists = await this.prisma.board.findFirst({
      where: { createdBy: userID, name: createBoardDto.name }
    })

    if (exists) {
      throw new BadRequestException('Ya tienes creada una pizarra con ese nombre')
    }

    await this.prisma.board.create({
      data: { ...createBoardDto, createdBy: userID }
    })

    return {
      'message': 'Pizarra creada con exito'
    }
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

  async update(userId: string, id: string, updateBoardDto: UpdateBoardDto) {
    const { state, ...res } = updateBoardDto

    const exists = await this.prisma.board.findFirst({
      where: { createdBy: userId, id }
    })

    if (!exists) {
      throw new NotFoundException('Pizarra no encontrada')
    }

    const updatedBoard = await this.prisma.board.update({
      where: { createdBy: userId, id },
      data: {
        ...res,
        state: state as BoardState
      }
    })
    console.log(updateBoardDto)
    return {
      'message': `Pizarra actualizada`,
      'board': updatedBoard
    }
  }

  async remove(userId: string, id: string) {
    const exists = await this.prisma.board.findFirst({
      where: { createdBy: userId, id }
    })

    if (!exists) {
      throw new NotFoundException('Pizarra no encontrada')
    }

    await this.prisma.board.delete({
      where: { createdBy: userId, id }
    })

    return {
      'message': 'Pizarra eliminada'
    }
  }
}
