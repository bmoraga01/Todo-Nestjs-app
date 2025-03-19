import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

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
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
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
