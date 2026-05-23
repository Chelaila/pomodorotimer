import { TimerConfig } from '../timer/Timer.interface';

export interface UseTimerProps {
  onTimeEnd: () => void;
}

export interface UseTaskProps {
  onTaskComplete?: (taskId: number) => void;
}

export interface UseConfigProps {
  onConfigChange?: (config: TimerConfig) => void;
} 