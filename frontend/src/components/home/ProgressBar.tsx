import * as React from 'react';
import { useTimerProgress } from '../../contexts/TimerProgressContext';

interface ProgressBarProps {
  progress: number; // valor entre 0 y 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const { currentTimerType } = useTimerProgress();

  const getProgressColor = () => {
    switch (currentTimerType) {
      case 'pomodoro':
        return 'bg-primary-main';
      case 'descanso-corto':
        return 'bg-accent-main';
      case 'descanso-largo':
        return 'bg-secondary-main';
      default:
        return 'bg-primary-main';
    }
  };

  return (
    <div className="w-full bg-background-dark rounded-full h-1">
      <div
        className={`${getProgressColor()} h-1 rounded-full transition-all duration-300 ease-in-out`}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
};

export default ProgressBar;
