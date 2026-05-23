import { Task } from './task';

export type TimerType = 'pomodoro' | 'descanso-corto' | 'descanso-largo';

export interface TimerConfig {
  id: number;
  name: string;
  pomodoroTime: number; // tiempo de trabajo en minutos
  shortBreakTime: number; // tiempo de descanso corto en minutos
  longBreakTime: number; // tiempo de descanso largo en minutos
  longBreakInterval: number; // número de pomodoros antes del descanso largo
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TimerProps {
  isActive: boolean;
  currentTimerType: TimerType;
  currentTask: Task | null;
  initialTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  onTimeEnd: () => void;
  onTimerTypeChange: (type: TimerType) => void;
  onReset: () => void;
}

export interface ControlsProps {
  isActive: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}
