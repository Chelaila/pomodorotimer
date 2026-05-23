import { Task } from '../task/Task.interface';
import { TimerConfig } from '../timer/Timer.interface';
import { Session } from '../session/Session.interface';

export interface HomeViewProps {
  currentTask: Task | null;
  error: string | null;
  tasks: Task[];
  selectedTaskId: string | null;
  activeConfig: TimerConfig;
  activeSession: Session | null;
  onTaskSelect: (task: Task) => void;
  onTaskComplete: (taskId: string) => Promise<void>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onTaskToggle: (taskId: string) => Promise<void>;
  onTimeEnd: () => void;
  onNewSession: (name: string) => Promise<void>;
}