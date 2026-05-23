import { TimerType } from '../types/timer';

export const TIMER_TYPES: TimerType[] = ['pomodoro', 'descanso-corto', 'descanso-largo'];

export const TIMER_TYPE_LABELS: Record<TimerType, string> = {
  'pomodoro': 'Trabajo',
  'descanso-corto': 'Descanso Corto',
  'descanso-largo': 'Descanso Largo'
};

export const TIMER_TYPE_EMOJIS: Record<TimerType, string> = {
  'pomodoro': '🍅',
  'descanso-corto': '☕',
  'descanso-largo': '🌟'
};

export const DEFAULT_TIMER_CONFIG = {
  pomodoroTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  longBreakInterval: 4
}; 