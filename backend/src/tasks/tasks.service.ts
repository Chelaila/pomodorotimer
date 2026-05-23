import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { Session } from '../sessions/entities/session.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  private async activeSessionId(): Promise<string | null> {
    const session = await this.sessionRepository.findOne({ where: { isActive: true } });
    return session?.id ?? null;
  }

  async findAll(): Promise<Task[]> {
    const sessionId = await this.activeSessionId();
    if (!sessionId) return [];
    return this.tasksRepository.find({
      where: { sessionId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);
    return task;
  }

  async create(dto: Partial<Task>): Promise<Task> {
    const sessionId = await this.activeSessionId();
    const newTask = this.tasksRepository.create({ ...dto, sessionId });
    return this.tasksRepository.save(newTask);
  }

  async update(id: string, dto: Partial<Task>): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, dto);
    return this.tasksRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Task with ID ${id} not found`);
  }
}
