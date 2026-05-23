import * as React from 'react';
import { useState } from 'react';
import { Session } from '../../interfaces/session/Session.interface';

interface SessionHeaderProps {
  activeSession: Session | null;
  onNewSession: (name: string) => Promise<void>;
  onShowHistory: () => void;
}

const SessionHeader: React.FC<SessionHeaderProps> = ({ activeSession, onNewSession, onShowHistory }) => {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onNewSession(name.trim());
    setName('');
    setCreating(false);
    setLoading(false);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="mb-3">
      {creating ? (
        <form onSubmit={handleCreate} className="flex items-center space-x-2">
          <input
            autoFocus
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={`Sesión del ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}`}
            className="flex-1 px-3 py-1.5 text-sm border border-[var(--border-medium)] rounded bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-3 py-1.5 text-sm bg-primary-light text-white rounded hover:opacity-90 disabled:opacity-50"
          >
            Crear
          </button>
          <button
            type="button"
            onClick={() => setCreating(false)}
            className="px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            Cancelar
          </button>
        </form>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide font-medium">Sesión actual</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {activeSession?.name ?? '—'}
              {activeSession && (
                <span className="ml-2 text-xs font-normal text-[var(--text-tertiary)]">
                  {formatDate(activeSession.createdAt)}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onShowHistory}
              className="flex items-center space-x-1 text-xs text-[var(--text-secondary)] hover:text-primary-light px-2 py-1 rounded border border-[var(--border-medium)] hover:border-primary-light transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>Historial</span>
            </button>
            <button
              onClick={() => setCreating(true)}
              className="flex items-center space-x-1 text-xs text-white bg-primary-light hover:opacity-90 px-2 py-1 rounded transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>Nueva sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionHeader;
