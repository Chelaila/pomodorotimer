import * as React from 'react';
import { TimerConfig } from '../../interfaces/timer/Timer.interface';
import ConfigForm from './ConfigForm';

interface EditConfigModalProps {
  config: TimerConfig;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (config: Partial<TimerConfig>) => void;
}

const EditConfigModal: React.FC<EditConfigModalProps> = ({ config, onClose, onSubmit, onChange }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[var(--bg-secondary)] rounded-lg shadow-xl w-full max-w-md border border-[var(--border-light)]">
        <div className="flex justify-between items-center px-6 pt-5 pb-4 border-b border-[var(--border-light)]">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Editar Configuración</h2>
          <button
            onClick={onClose}
            className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] rounded p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <ConfigForm
            config={config}
            onSubmit={onSubmit}
            onChange={onChange}
            title=""
            submitButtonText="Guardar cambios"
          />
        </div>
      </div>
    </div>
  );
};

export default EditConfigModal;
