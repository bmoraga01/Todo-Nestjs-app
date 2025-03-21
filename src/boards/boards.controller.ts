import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Put } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Req() req: Request & { user: { id: string } }, @Body() createBoardDto: CreateBoardDto) {
    return this.boardsService.create(req.user.id, createBoardDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Req() req: Request & { user: { id: string } }) {
    return this.boardsService.findAll(req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.boardsService.findOne(req.user.id, id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Req() req: Request & { user: { id: string } }, @Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto
  ) {
    return this.boardsService.update(req.user.id, id, updateBoardDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.boardsService.remove(req.user.id, id);
  }
}
