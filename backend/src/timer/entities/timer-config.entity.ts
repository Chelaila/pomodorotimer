import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('timer_configs')
export class TimerConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ default: 25 })
  pomodoroTime: number; // tiempo de trabajo en minutos

  @Column({ default: 5 })
  shortBreakTime: number; // tiempo de descanso corto en minutos

  @Column({ default: 15 })
  longBreakTime: number; // tiempo de descanso largo en minutos

  @Column({ default: 4 })
  longBreakInterval: number; // número de pomodoros antes del descanso largo

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 