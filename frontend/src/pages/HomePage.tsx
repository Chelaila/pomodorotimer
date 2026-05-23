import React, { useState, useEffect, useCallback } from 'react';
import HomeView from '../components/home/HomeView';
import { useTimer } from '../hooks/useTimer';
import { useTask } from '../hooks/useTask';
import { useConfig } from '../hooks/useConfig';
import { Task } from '../interfaces/task/Task.interface';
import { TimerConfig } from '../interfaces/timer/Timer.interface';
import { Session } from '../interfaces/session/Session.interface';

const defaultConfig: TimerConfig = {
  id: 0,
  name: 'Default',
  pomodoroTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  longBreakInterval: 4,
  isActive: true
};

const HomePage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<Session | null>(null);

  const { tasks, setTasks, completeTask, selectTask, toggleTask, currentTask } = useTask();

  const { activeConfig, loading: configLoading, error: configError } = useConfig();

  const { handleTimeEnd } = useTimer({
    onTimeEnd: async () => {
      if (currentTask) {
        await completeTask(currentTask.id);
      }
    }
  });

  const fetchActiveSession = useCallback(async () => {
    try {
      const res = await fetch('/api/sessions/active');
      if (res.ok) {
        const data: Session = await res.json();
        setActiveSession(data);
      }
    } catch {
      // non-fatal
    }
  }, []);

  useEffect(() => {
    fetchActiveSession();
  }, [fetchActiveSession]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (configError) {
      setError(configError);
    }
  }, [configError]);

  const handleTaskSelect = (task: Task) => {
    selectTask(task);
  };

  const handleTaskComplete = async (taskId: string) => {
    try {
      await completeTask(taskId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al completar la tarea');
    }
  };

  const handleTaskToggle = async (taskId: string) => {
    try {
      await toggleTask(taskId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar el estado de la tarea');
    }
  };

  const handleNewSession = async (name: string) => {
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Error al crear sesión');
      const newSession: Session = await res.json();
      setActiveSession(newSession);
      setTasks([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear sesión');
    }
  };

  if (configLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-primary-main">Cargando configuración...</div>
      </div>
    );
  }

  return (
    <HomeView
      currentTask={currentTask}
      error={error}
      activeConfig={activeConfig || defaultConfig}
      tasks={tasks}
      selectedTaskId={currentTask?.id || null}
      activeSession={activeSession}
      onTaskSelect={handleTaskSelect}
      onTaskComplete={handleTaskComplete}
      setTasks={setTasks}
      onTaskToggle={handleTaskToggle}
      onTimeEnd={handleTimeEnd}
      onNewSession={handleNewSession}
    />
  );
};

export default HomePage;
