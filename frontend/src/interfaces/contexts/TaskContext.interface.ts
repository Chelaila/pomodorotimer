import { Task } from '../task/Task.interface';

export interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  loading: boolean;
  error: string | null;
}

export interface TaskContextType {
  state: TaskState;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (taskId: number, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
  toggleTask: (taskId: number) => Promise<void>;
  selectTask: (task: Task | null) => void;
  completeTask: (taskId: number) => Promise<void>;
  fetchTasks: () => Promise<void>;
} 