import * as React from 'react';
import { TimerConfig } from '../../interfaces/timer/Timer.interface';
import ConfigCard from './ConfigCard';

interface ConfigListProps {
  configs: TimerConfig[];
  onEdit: (config: TimerConfig) => void;
  onDelete: (id: string) => void;
  onSetActive: (id: string) => void;
}

const ConfigList: React.FC<ConfigListProps> = ({
  configs,
  onEdit,
  onDelete,
  onSetActive
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Configuraciones Existentes</h2>
      {configs.length === 0 ? (
        <p className="text-gray-500">No hay configuraciones disponibles</p>
      ) : (
        <div className="space-y-4">
          {configs.map((config) => (
            <ConfigCard
              key={config.id}
              config={config}
              onEdit={onEdit}
              onDelete={onDelete}
              onSetActive={onSetActive}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ConfigList; 