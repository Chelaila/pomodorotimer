import React from 'react';
import ConfigForm from '../components/config/ConfigForm';
import EditConfigModal from '../components/config/EditConfigModal';
import { useConfig } from '../hooks/useConfig';

const TimerConfigPage: React.FC = () => {
  const {
    configs,
    loading,
    error,
    newConfig,
    editingConfig,
    setNewConfig,
    setEditingConfig,
    handleEditingConfigChange,
    handleCreateConfig,
    handleUpdateConfig,
    handleDeleteConfig,
    handleSetActive,
  } = useConfig();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light" />
      </div>
    );
  }

  const handleSetActiveConfig = async (id: number) => {
    const config = configs.find(c => c.id === id);
    if (config) await handleSetActive(config);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-[var(--text-primary)]">Configuración del Temporizador</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Saved configs */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">Configuraciones Guardadas</h2>
          <div className="space-y-3">
            {configs.map(config => (
              <div
                key={config.id}
                className={`bg-[var(--bg-secondary)] rounded-lg border p-4 transition-colors ${
                  config.isActive
                    ? 'border-primary-light shadow-sm'
                    : 'border-[var(--border-light)]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)]">{config.name}</h3>
                    {config.isActive && (
                      <span className="inline-block mt-1 text-xs font-medium bg-primary-light text-white px-2 py-0.5 rounded">
                        Activa
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    {!config.isActive && (
                      <button
                        onClick={() => handleSetActiveConfig(config.id)}
                        className="text-xs px-2 py-1 rounded border border-primary-light text-primary-light hover:bg-primary-light hover:text-white transition-colors"
                      >
                        Activar
                      </button>
                    )}
                    <button
                      onClick={() => setEditingConfig(config)}
                      className="text-xs px-2 py-1 rounded border border-[var(--border-medium)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)] transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteConfig(config.id.toString())}
                      className="text-xs px-2 py-1 rounded border border-red-400 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-tertiary)]">
                  🍅 {config.pomodoroTime} min &nbsp;·&nbsp;
                  ☕ {config.shortBreakTime} min &nbsp;·&nbsp;
                  🌙 {config.longBreakTime} min &nbsp;·&nbsp;
                  cada {config.longBreakInterval} pomodoros
                </p>
              </div>
            ))}
            {configs.length === 0 && (
              <p className="text-sm text-[var(--text-tertiary)] py-4 text-center">No hay configuraciones guardadas.</p>
            )}
          </div>
        </div>

        {/* New config form */}
        <ConfigForm
          config={newConfig}
          onSubmit={handleCreateConfig}
          onChange={setNewConfig}
          title="Nueva Configuración"
          submitButtonText="Crear Configuración"
        />
      </div>

      {editingConfig && (
        <EditConfigModal
          config={editingConfig}
          onClose={() => setEditingConfig(null)}
          onSubmit={handleUpdateConfig}
          onChange={handleEditingConfigChange}
        />
      )}
    </div>
  );
};

export default TimerConfigPage;
