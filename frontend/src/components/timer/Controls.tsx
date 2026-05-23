import * as React from 'react';
import { ControlsProps } from '../../interfaces/timer/Timer.interface';

const Controls: React.FC<ControlsProps> = ({ isActive, onStart, onPause, onReset }) => {
  const handleReset = () => {
    if (isActive) {
      onPause();
    }
    onReset();
  };

  return (
    <div className="flex space-x-4">
      {!isActive ? (
        <button
          onClick={onStart}
          className="px-6 py-2 rounded-lg font-medium bg-primary-main text-text-light hover:bg-primary-dark transition-colors duration-200"
          disabled={isActive}
        >
          Iniciar
        </button>
      ) : (
        <button
          onClick={onPause}
          className="px-6 py-2 rounded-lg font-medium bg-secondary-main text-text-light hover:bg-secondary-dark transition-colors duration-200"
          disabled={!isActive}
        >
          Pausar
        </button>
      )}
      <button
        onClick={handleReset}
        className="px-6 py-2 rounded-lg font-medium bg-secondary-main text-text-light hover:bg-secondary-dark transition-colors duration-200"
      >
        Reiniciar
      </button>
    </div>
  );
};

export default Controls;
