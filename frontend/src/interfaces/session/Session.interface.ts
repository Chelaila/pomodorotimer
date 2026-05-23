import { Task } from '../task/Task.interface';

export interface Session {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  tasks: Task[];
  completedCount: number;
  totalCount: number;
}
