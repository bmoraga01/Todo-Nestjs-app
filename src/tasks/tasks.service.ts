import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {

  constructor(
    private prisma: PrismaService
  ) {}

  create(createTaskDto: CreateTaskDto) {
    return 'This action adds a new task';
  }

  async findAll(userId: string, boardId: string) {

    const tasks = await this.prisma.task.findMany({
      where: { boardId }
    })

    if (!tasks.length) {
      throw new NotFoundException('No tienes tareas creadas')
    }

    return tasks;
  }

  async findOne(boardId: string, taskId: string) {

    const task = await this.prisma.task.findFirst({
      where: { id: taskId, boardId }
    })

    if (!task) {
      throw new NotFoundException('Tarea no encontrada')
    }

    return task
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
