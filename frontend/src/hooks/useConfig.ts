import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { TimerConfig } from '../interfaces/timer/Timer.interface';

export const useConfig = () => {
  const [configs, setConfigs] = useState<TimerConfig[]>([]);
  const [activeConfig, setActiveConfig] = useState<TimerConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newConfig, setNewConfig] = useState<Partial<TimerConfig>>({
    name: '',
    pomodoroTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    longBreakInterval: 4,
  });
  const [editingConfig, setEditingConfig] = useState<TimerConfig | null>(null);

  const handleEditingConfigChange = (config: Partial<TimerConfig>) => {
    if (editingConfig) {
      setEditingConfig({ ...editingConfig, ...config });
    }
  };

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      setError(null);
      const [configsResponse, activeConfigResponse] = await Promise.all([
        axios.get<TimerConfig[]>('/api/timer-configs'),
        axios.get<TimerConfig>('/api/timer-configs/active')
      ]);
      setConfigs(configsResponse.data);
      setActiveConfig(activeConfigResponse.data);
    } catch (err: any) {
      console.error('Error fetching configs:', err);
      if (err?.response?.data?.message) {
        setError(`Error al cargar las configuraciones: ${err.response.data.message}`);
      } else {
        setError('Error al cargar las configuraciones');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await axios.post('/api/timer-configs', newConfig);
      setNewConfig({
        name: '',
        pomodoroTime: 25,
        shortBreakTime: 5,
        longBreakTime: 15,
        longBreakInterval: 4,
      });
      fetchConfigs();
    } catch (err: any) {
      console.error('Error creating config:', err);
      if (err?.response?.data?.message) {
        setError(`Error al crear la configuración: ${err.response.data.message}`);
      } else {
        setError('Error al crear la configuración');
      }
    }
  };

  const handleUpdateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingConfig) return;
    
    try {
      setError(null);
      await axios.put(`/api/timer-configs/${editingConfig.id}`, editingConfig);
      setEditingConfig(null);
      fetchConfigs();
    } catch (err: any) {
      console.error('Error updating config:', err);
      if (err?.response?.data?.message) {
        setError(`Error al actualizar la configuración: ${err.response.data.message}`);
      } else {
        setError('Error al actualizar la configuración');
      }
    }
  };

  const handleDeleteConfig = async (id: string) => {
    try {
      setError(null);
      await axios.delete(`/api/timer-configs/${id}`);
      fetchConfigs();
    } catch (err: any) {
      console.error('Error deleting config:', err);
      if (err?.response?.data?.message) {
        setError(`Error al eliminar la configuración: ${err.response.data.message}`);
      } else {
        setError('Error al eliminar la configuración');
      }
    }
  };

  const handleSetActive = async (config: TimerConfig) => {
    try {
      setError(null);
      await axios.put(`/api/timer-configs/${config.id}/activate`);
      setActiveConfig(config);
      fetchConfigs();
    } catch (err: any) {
      console.error('Error setting active config:', err);
      if (err?.response?.data?.message) {
        setError(`Error al establecer la configuración activa: ${err.response.data.message}`);
      } else {
        setError('Error al establecer la configuración activa');
      }
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  return {
    configs,
    activeConfig,
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
    handleSetActive
  };
}; 