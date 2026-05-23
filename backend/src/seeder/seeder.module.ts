import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimerConfig } from '../timer/entities/timer-config.entity';
import { Task } from '../tasks/entities/task.entity';
import { Session } from '../sessions/entities/session.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([TimerConfig, Task, Session])],
  providers: [SeederService],
})
export class SeederModule {}
