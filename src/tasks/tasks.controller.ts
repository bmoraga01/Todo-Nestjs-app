import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('boards/:id/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // @Get()
  // getTasksByBoard(@Param('id') boardId: string) {
  //   return this.tasksService.getTasksByBoardId(boardId);
  // }

  // @Get(':taskId')
  // getTask(@Param('id') boardId: string, @Param('taskId') taskId: string) {
  //   return this.tasksService.getTaskById(boardId, taskId);
  // }
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(
    @Req() req: Request & { user: { id: string } },
    @Param('id') boardId: string
  ) {
    return this.tasksService.findAll(req.user.id, boardId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(
    @Req() req: Request & { user: { id: string } },
    @Param('id') boardId: string,
    @Param('taskId') taskId: string
  ) {
    return this.tasksService.findOne(boardId, taskId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
