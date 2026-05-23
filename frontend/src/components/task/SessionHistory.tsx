import * as React from 'react';
import { useState, useEffect } from 'react';
import { Session } from '../../interfaces/session/Session.interface';

interface SessionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

const SessionHistory: React.FC<SessionHistoryProps> = ({ isOpen, onClose }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch('/api/sessions')
      .then(r => r.json())
      .then(data => setSessions(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-[var(--bg-secondary)] rounded-xl shadow-2xl border border-[var(--border-light)] flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-light)]">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Historial de sesiones</h2>
          <button
            onClick={onClose}
            className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-3 space-y-3">
          {loading && (
            <p className="text-center text-sm text-[var(--text-tertiary)] py-8">Cargando...</p>
          )}
          {!loading && sessions.length === 0 && (
            <p className="text-center text-sm text-[var(--text-tertiary)] py-8">No hay sesiones guardadas.</p>
          )}
          {!loading && sessions.map(session => {
            const pct = session.totalCount > 0
              ? Math.round((session.completedCount / session.totalCount) * 100)
              : 0;
            const isExpanded = expanded === session.id;

            return (
              <div
                key={session.id}
                className="rounded-lg border border-[var(--border-medium)] bg-[var(--bg-primary)] overflow-hidden"
              >
                {/* Session row */}
                <button
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[var(--bg-tertiary)] transition-colors"
                  onClick={() => setExpanded(isExpanded ? null : session.id)}
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--text-primary)] truncate">{session.name}</span>
                      {session.isActive && (
                        <span className="shrink-0 text-xs px-1.5 py-0.5 rounded-full bg-primary-light/15 text-primary-light font-medium">
                          activa
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex-1 h-1.5 bg-[var(--border-medium)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-light rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="shrink-0 text-xs text-[var(--text-tertiary)]">
                        {session.completedCount}/{session.totalCount} · {pct}%
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{formatDate(session.createdAt)}</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-[var(--text-tertiary)] shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Task list */}
                {isExpanded && (
                  <div className="border-t border-[var(--border-light)] px-4 py-2 space-y-1">
                    {session.tasks.length === 0 && (
                      <p className="text-xs text-[var(--text-tertiary)] py-2 text-center">Sin tareas</p>
                    )}
                    {session.tasks.map(task => (
                      <div key={task.id} className="flex items-center gap-2 py-1.5">
                        <span className={`text-sm ${task.completed ? 'line-through text-[var(--text-tertiary)]' : 'text-[var(--text-primary)]'}`}>
                          {task.completed ? '✓' : '○'} {task.title}
                        </span>
                        <span className="ml-auto text-xs text-[var(--text-tertiary)] shrink-0">🍅 {task.pomodoros}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SessionHistory;
