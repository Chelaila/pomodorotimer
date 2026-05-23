import * as React from 'react';
import { TimerConfig } from '../../types/timer';

interface ConfigModalProps {
  configs: TimerConfig[];
  activeConfig: TimerConfig | null;
  onClose: () => void;
  onSelect: (config: TimerConfig) => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({
  configs,
  activeConfig,
  onClose,
  onSelect,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Seleccionar Configuración</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          {configs.map((config) => (
            <div
              key={config.id}
              className={`p-4 rounded-lg border ${
                activeConfig?.id === config.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              } cursor-pointer`}
              onClick={() => onSelect(config)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{config.name}</h3>
                  <div className="text-sm text-gray-600">
                    <p>Pomodoro: {config.pomodoroTime} min</p>
                    <p>Descanso Corto: {config.shortBreakTime} min</p>
                    <p>Descanso Largo: {config.longBreakTime} min</p>
                  </div>
                </div>
                {activeConfig?.id === config.id && (
                  <div className="text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConfigModal; 