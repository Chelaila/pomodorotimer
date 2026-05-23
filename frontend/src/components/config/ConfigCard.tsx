import * as React from 'react';
import { TimerConfig } from '../../interfaces/timer/Timer.interface';

interface ConfigCardProps {
  config: TimerConfig;
  onEdit: (config: TimerConfig) => void;
  onDelete: (id: string) => void;
  onSetActive: (id: string) => void;
}

const ConfigCard: React.FC<ConfigCardProps> = ({
  config,
  onEdit,
  onDelete,
  onSetActive
}) => {
  return (
    <div
      className={`p-4 border rounded ${
        config.isActive ? 'border-green-500 bg-green-50' : ''
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">{config.name}</h3>
        {config.isActive ? (
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
            Activa
          </span>
        ) : (
          <button
            onClick={() => onSetActive(config.id.toString())}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            Activar
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="font-medium">Pomodoro:</span> {config.pomodoroTime} min
        </div>
        <div>
          <span className="font-medium">Descanso Corto:</span> {config.shortBreakTime} min
        </div>
        <div>
          <span className="font-medium">Descanso Largo:</span> {config.longBreakTime} min
        </div>
        <div>
          <span className="font-medium">Intervalo:</span> {config.longBreakInterval}
        </div>
      </div>
      <div className="mt-2 flex space-x-2">
        <button
          onClick={() => onEdit(config)}
          className="text-blue-500 hover:text-blue-700 text-sm"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(config.id.toString())}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ConfigCard; 