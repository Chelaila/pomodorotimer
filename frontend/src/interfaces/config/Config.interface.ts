import { TimerConfig } from '../timer/Timer.interface';

export interface ConfigFormProps {
  config: TimerConfig;
  onSubmit: (config: TimerConfig) => void;
  onCancel: () => void;
}

export interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: TimerConfig;
  onSubmit: (config: TimerConfig) => void;
} 