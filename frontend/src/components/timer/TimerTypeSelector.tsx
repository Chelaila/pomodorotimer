import * as React from 'react';
import { TimerType } from '../../interfaces/timer/Timer.interface';

interface TimerTypeSelectorProps {
  currentTimerType: TimerType;
  onTimerTypeChange: (type: TimerType) => void;
}

const TimerTypeSelector: React.FC<TimerTypeSelectorProps> = ({
  currentTimerType,
  onTimerTypeChange,
}) => {
  return (
    <div className="flex space-x-4">
      <button
        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
          currentTimerType === 'pomodoro'
            ? 'bg-primary-light text-text-light'
            : 'bg-background-dark text-primary-main hover:bg-secondary-main'
        }`}
        onClick={() => onTimerTypeChange('pomodoro')}
      >
        Trabajo
      </button>
      <button
        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
          currentTimerType === 'descanso-corto'
            ? 'bg-primary-light text-text-light'
            : 'bg-background-dark text-primary-main hover:bg-secondary-main'
        }`}
        onClick={() => onTimerTypeChange('descanso-corto')}
      >
        Descanso Corto
      </button>
      <button
        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
          currentTimerType === 'descanso-largo'
            ? 'bg-primary-light text-text-light'
            : 'bg-background-dark text-primary-main hover:bg-secondary-main'
        }`}
        onClick={() => onTimerTypeChange('descanso-largo')}
      >
        Descanso Largo
      </button>
    </div>
  );
};

export default TimerTypeSelector; 