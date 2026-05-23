import { TimerConfig } from '../timer/Timer.interface';

export interface ConfigState {
  configs: TimerConfig[];
  activeConfig: TimerConfig | null;
  loading: boolean;
  error: string | null;
}

export interface ConfigContextType {
  state: ConfigState;
  fetchConfigs: () => Promise<void>;
  createConfig: (config: Omit<TimerConfig, 'id'>) => Promise<void>;
  updateConfig: (configId: number, updates: Partial<TimerConfig>) => Promise<void>;
  deleteConfig: (configId: number) => Promise<void>;
  setActiveConfig: (config: TimerConfig) => Promise<void>;
  resetToDefault: () => Promise<void>;
} 