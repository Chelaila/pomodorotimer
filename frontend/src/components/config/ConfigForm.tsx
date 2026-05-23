import * as React from 'react';
import { TimerConfig } from '../../types/timer';

interface ConfigFormProps {
  config: Partial<TimerConfig>;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (config: Partial<TimerConfig>) => void;
  title: string;
  submitButtonText: string;
}

const inputClass =
  'w-full px-3 py-2 border border-[var(--border-medium)] rounded bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary-light';

const labelClass = 'block text-sm font-medium text-[var(--text-secondary)] mb-1';

const ConfigForm: React.FC<ConfigFormProps> = ({ config, onSubmit, onChange, title, submitButtonText }) => {
  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-md border border-[var(--border-light)]">
      {title && <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">{title}</h2>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="cf-name" className={labelClass}>Nombre</label>
          <input
            id="cf-name"
            type="text"
            value={config.name || ''}
            onChange={e => onChange({ ...config, name: e.target.value })}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label htmlFor="cf-pomodoro" className={labelClass}>Tiempo de Trabajo (min)</label>
          <input
            id="cf-pomodoro"
            type="number"
            value={config.pomodoroTime || 25}
            onChange={e => onChange({ ...config, pomodoroTime: Number.parseInt(e.target.value) })}
            className={inputClass}
            min="1"
            max="60"
            required
          />
        </div>
        <div>
          <label htmlFor="cf-short" className={labelClass}>Descanso Corto (min)</label>
          <input
            id="cf-short"
            type="number"
            value={config.shortBreakTime || 5}
            onChange={e => onChange({ ...config, shortBreakTime: Number.parseInt(e.target.value) })}
            className={inputClass}
            min="1"
            max="30"
            required
          />
        </div>
        <div>
          <label htmlFor="cf-long" className={labelClass}>Descanso Largo (min)</label>
          <input
            id="cf-long"
            type="number"
            value={config.longBreakTime || 15}
            onChange={e => onChange({ ...config, longBreakTime: Number.parseInt(e.target.value) })}
            className={inputClass}
            min="1"
            max="60"
            required
          />
        </div>
        <div>
          <label htmlFor="cf-interval" className={labelClass}>Intervalo para Descanso Largo</label>
          <input
            id="cf-interval"
            type="number"
            value={config.longBreakInterval || 4}
            onChange={e => onChange({ ...config, longBreakInterval: Number.parseInt(e.target.value) })}
            className={inputClass}
            min="1"
            max="10"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary-light text-white px-4 py-2 rounded hover:opacity-90 font-medium"
        >
          {submitButtonText}
        </button>
      </form>
    </div>
  );
};

export default ConfigForm;
