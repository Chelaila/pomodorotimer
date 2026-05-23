import * as React from 'react';
import { useState, useEffect } from 'react';
import { Task } from '../../interfaces/task/Task.interface';
import { TaskListProps } from '../../interfaces/task/TaskList.interface';

export const TaskList = ({ tasks, selectedTaskId, onTaskSelect, setTasks, onTaskToggle, sessionKey }: TaskListProps) => {
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [sessionKey]);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Error al cargar las tareas');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTask }),
      });
      if (!response.ok) throw new Error('Error al crear la tarea');
      const newTaskData: Task = await response.json();
      setTasks([...tasks, newTaskData]);
      setNewTask('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  if (loading) return <div className="text-center text-[var(--text-secondary)]">Cargando tareas...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Nueva tarea..."
          className="flex-1 p-2 border border-[var(--border-dark)] rounded bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
        <button
          type="submit"
          className="bg-primary-light hover:opacity-90 text-white font-bold py-2 px-4 rounded"
        >
          Agregar
        </button>
      </form>

      <div className="space-y-2">
        {tasks.map((task: Task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between p-3 rounded border transition-colors ${
              task.id === selectedTaskId
                ? 'border-primary-light bg-[var(--bg-tertiary)]'
                : 'border-[var(--border-medium)] bg-[var(--bg-secondary)]'
            }`}
          >
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onTaskToggle(task.id)}
                className="h-5 w-5 accent-primary-light"
              />
              <div className="flex flex-col">
                <span className={task.completed ? 'text-[var(--text-tertiary)] line-through' : 'text-[var(--text-primary)]'}>
                  {task.title}
                </span>
                <div className="text-sm text-[var(--text-tertiary)]">
                  <span>🍅 {task.pomodoros} pomodoros</span>
                  <span className="mx-2">•</span>
                  <span>Creada: {new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onTaskSelect(task)}
              className="text-primary-light hover:opacity-75 text-sm font-medium"
            >
              Seleccionar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
