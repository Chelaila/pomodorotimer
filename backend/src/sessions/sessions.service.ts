import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { Task } from '../tasks/entities/task.entity';

export interface SessionWithTasks extends Session {
  tasks: Task[];
  completedCount: number;
  totalCount: number;
}

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async findAll(): Promise<SessionWithTasks[]> {
    const sessions = await this.sessionRepo.find({ order: { createdAt: 'DESC' } });
    return Promise.all(
      sessions.map(async s => {
        const tasks = await this.taskRepo.find({
          where: { sessionId: s.id },
          order: { createdAt: 'ASC' },
        });
        return {
          ...s,
          tasks,
          totalCount: tasks.length,
          completedCount: tasks.filter(t => t.completed).length,
        };
      }),
    );
  }

  async findActive(): Promise<SessionWithTasks | null> {
    const session = await this.sessionRepo.findOne({ where: { isActive: true } });
    if (!session) return null;
    const tasks = await this.taskRepo.find({
      where: { sessionId: session.id },
      order: { createdAt: 'ASC' },
    });
    return {
      ...session,
      tasks,
      totalCount: tasks.length,
      completedCount: tasks.filter(t => t.completed).length,
    };
  }

  async create(name?: string): Promise<Session> {
    await this.sessionRepo.update({ isActive: true }, { isActive: false });
    const label = name?.trim() || `Sesión del ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}`;
    const session = this.sessionRepo.create({ name: label, isActive: true });
    return this.sessionRepo.save(session);
  }

  async remove(id: string): Promise<void> {
    const session = await this.sessionRepo.findOne({ where: { id } });
    if (!session) throw new NotFoundException(`Session ${id} not found`);
    if (session.isActive) throw new NotFoundException('Cannot delete the active session');
    await this.taskRepo.delete({ sessionId: id });
    await this.sessionRepo.delete(id);
  }
}
