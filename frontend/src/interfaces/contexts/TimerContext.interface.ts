import { TimerType } from '../timer/Timer.interface';
import { Task } from '../task/Task.interface';

export interface TimerState {
  isActive: boolean;
  currentTimerType: TimerType;
  currentTask: Task | null;
  timeLeft: number;
  initialTime: number;
  shortBreakTime: number;
  longBreakTime: number;
}

export interface TimerContextType {
  state: TimerState;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setCurrentTask: (task: Task | null) => void;
  changeTimerType: (type: TimerType) => void;
  updateTimes: (initial: number, shortBreak: number, longBreak: number) => void;
} 