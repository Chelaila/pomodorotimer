import { Task } from './Task.interface';
import { Dispatch, SetStateAction } from 'react';

export interface TaskListProps {
  tasks: Task[];
  selectedTaskId: string | null;
  onTaskSelect: (task: Task) => void;
  setTasks: Dispatch<SetStateAction<Task[]>>;
  onTaskToggle: (taskId: string) => void;
  sessionKey?: string;
} 