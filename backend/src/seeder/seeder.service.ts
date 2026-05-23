import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { TimerConfig } from '../timer/entities/timer-config.entity';
import { Task } from '../tasks/entities/task.entity';
import { Session } from '../sessions/entities/session.entity';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(TimerConfig)
    private timerConfigRepo: Repository<TimerConfig>,
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
    @InjectRepository(Session)
    private sessionRepo: Repository<Session>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedTimerConfigs();
    const activeSession = await this.ensureActiveSession();
    await this.seedTasks(activeSession.id);
    await this.migrateOrphanTasks(activeSession.id);
  }

  private async ensureActiveSession(): Promise<Session> {
    let active = await this.sessionRepo.findOne({ where: { isActive: true } });
    if (!active) {
      active = await this.sessionRepo.save({
        name: 'Sesión inicial',
        isActive: true,
      });
      this.logger.log('Created initial session');
    }
    return active;
  }

  // Assign any tasks with no sessionId (from before sessions were introduced)
  private async migrateOrphanTasks(sessionId: string): Promise<void> {
    const result = await this.taskRepo.update({ sessionId: IsNull() }, { sessionId });
    if (result.affected && result.affected > 0) {
      this.logger.log(`Migrated ${result.affected} orphan task(s) to active session`);
    }
  }

  private async seedTimerConfigs() {
    const count = await this.timerConfigRepo.count();
    if (count > 0) return;

    const configs = [
      { name: 'Clásico Pomodoro', pomodoroTime: 25, shortBreakTime: 5,  longBreakTime: 15, longBreakInterval: 4, isActive: true },
      { name: 'Focus intenso',    pomodoroTime: 50, shortBreakTime: 10, longBreakTime: 30, longBreakInterval: 3, isActive: false },
      { name: 'Sesión corta',     pomodoroTime: 15, shortBreakTime: 3,  longBreakTime: 10, longBreakInterval: 4, isActive: false },
    ];
    await this.timerConfigRepo.save(configs);
    this.logger.log(`Seeded ${configs.length} timer configs`);
  }

  private async seedTasks(sessionId: string) {
    const count = await this.taskRepo.count();
    if (count > 0) return;

    const tasks = [
      { title: 'Revisar emails',             completed: false, pomodoros: 1, sessionId },
      { title: 'Reunión de equipo',          completed: true,  pomodoros: 2, sessionId },
      { title: 'Implementar nueva feature',  completed: false, pomodoros: 4, sessionId },
      { title: 'Code review PR #42',         completed: false, pomodoros: 2, sessionId },
      { title: 'Actualizar documentación',   completed: false, pomodoros: 1, sessionId },
    ];
    await this.taskRepo.save(tasks);
    this.logger.log(`Seeded ${tasks.length} tasks`);
  }
}
