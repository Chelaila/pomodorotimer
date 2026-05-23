import { useState, useCallback } from 'react';
import { Task } from '../types/task';
import api from '../services/api';

export const useTask = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  const completeTask = useCallback(async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.completed) return;
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: true } : t));
    try {
      await api.put(`/tasks/${taskId}`, { completed: true });
    } catch {
      setTasks(prev => prev.map(t => t.id === taskId ? task : t));
    }
  }, [tasks]);

  const selectTask = useCallback((task: Task) => {
    setCurrentTask(task);
  }, []);

  const toggleTask = useCallback(async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const newCompleted = !task.completed;
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: newCompleted } : t));
    try {
      await api.put(`/tasks/${taskId}`, { completed: newCompleted });
    } catch {
      setTasks(prev => prev.map(t => t.id === taskId ? task : t));
    }
  }, [tasks]);

  return {
    tasks,
    setTasks,
    currentTask,
    setCurrentTask,
    completeTask,
    selectTask,
    toggleTask,
  };
};
